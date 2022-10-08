import { createServer as createHttpServer, IncomingMessage, RequestListener, Server as HttpServer, ServerResponse } from 'http';
import { createServer as createHttpsServer, Server as HttpsServer, ServerOptions } from 'https';
import { hrtime } from 'node:process';
import client, { Histogram } from 'prom-client';
import { ClosedConnectionError } from '../errors/ClosedConnectionError.mjs';
import { MethodNotAllowedError } from '../errors/MethodNotAllowedError.mjs';
import { NotFoundError } from '../errors/NotFoundError.mjs';
import { error, ErrorRequestListener } from '../routeHandlers/error.mjs';
import { metrics } from '../routeHandlers/metrics.mjs';
import { targets } from '../routeHandlers/targets.mjs';
import { measureDuration } from '../utilities.mjs';
import { Config } from './Config.mjs';
import { DataStore } from './DataStore.mjs';
import { Server } from './HetznerApiClient.mjs';

export class WebServer
{
    private readonly config: Config;

    private readonly dataStore: DataStore<Server[]>;

    private metricsHandler: RequestListener | null = null;

    private targetsHandler: RequestListener | null = null;

    private errorHandler: ErrorRequestListener | null = null;

    private responseTimeMetric: Histogram<'path' | 'method' | 'status'>;

    public constructor( config: Config, dataStore: DataStore<Server[]> ) {
        this.config    = config;
        this.dataStore = dataStore;

        this.responseTimeMetric = new client.Histogram( {
            help: 'Duration of requests to the web server',
            name: 'response_time',
            labelNames: [ 'path', 'method', 'status' ],
        } );
    }

    public async start(): Promise<void> {
        const hostname = this.config.hostname;
        const port     = this.config.port;
        const server   = this.config.https
                         ? this.startHttpsServer()
                         : this.startHttpServer();

        this.metricsHandler = metrics( this.config, this.dataStore );
        this.targetsHandler = targets( this.config, this.dataStore );
        this.errorHandler   = error( this.config, this.dataStore );

        server.listen(
            port,
            hostname,
            () => this.onListening( hostname, port ),
        );
    }

    private startHttpServer(): HttpServer {
        return createHttpServer(
            {},
            this.onRequest.bind( this ),
        );
    }

    private startHttpsServer(): HttpsServer {
        const options: ServerOptions = {};

        if ( this.config.mTlsCa ) {
            options.requestCert        = true;
            options.rejectUnauthorized = true;
            options.ca                 = this.config.mTlsCa;
        }

        return createHttpsServer(
            options,
            this.onRequest.bind( this ),
        );
    }

    private onListening( hostname: string, port: number ) {
        console.info( `http_server\tserver is running at http://${ hostname }:${ port }` );
    }

    private async onRequest(
        request: IncomingMessage,
        response: ServerResponse,
    ): Promise<void> {
        const path = request.url?.split( '?', 2 ).shift();
        let duration: bigint;

        try {
            [ duration ] = await measureDuration( start => new Promise( async ( resolve, reject ) => {

                // Resolve as soon as the request has been sent completely
                response.addListener( 'finish', () => resolve(
                    response,
                ) );

                // Handle closed connections properly
                response.addListener( 'close', () => reject(
                    new ClosedConnectionError( hrtime.bigint() - start ),
                ) );

                response.setHeader(
                    'Content-Type',
                    'application/json; charset=utf-8',
                );

                // Reject any request methods but GET (or HEAD)
                if (
                    ![ 'GET', 'HEAD' ].includes( request.method?.toUpperCase() || '' ) &&
                    this.errorHandler
                ) {
                    return this.errorHandler(
                        request,
                        response,
                        new MethodNotAllowedError( [ 'GET' ] ),
                    );
                }

                try {
                    switch ( path ) {
                        case this.config.metricsEndpoint:
                            return this.metricsHandler && await this.metricsHandler(
                                request,
                                response,
                            );

                        case '/sd':
                            return this.targetsHandler && await this.targetsHandler(
                                request,
                                response,
                            );

                        default:
                            throw new NotFoundError( path || '/' );
                    }

                } catch ( error ) {
                    console.error( `http_server\tError while handling request: ${ error }` );
                    console.debug( 'http_server\t', error );

                    if ( error instanceof Error && this.errorHandler ) {
                        await this.errorHandler(
                            request,
                            response,
                            error,
                        );

                        return;
                    }

                    throw error;
                }
            } ) );

            this.responseTimeMetric.observe( {
                status: response.statusCode,
                method: request.method,
                path: path,
            }, Number( duration ) );

            console.info( `http_server\t${ response.statusCode }\t${ request.method } ${ request.url } HTTP/${ request.httpVersion }\t${ duration }ms` );
        } catch ( error ) {
            if ( error instanceof ClosedConnectionError ) {
                console.error( `http_server\t499\t${ request.method } ${ request.url } HTTP/${ request.httpVersion }\t${ error }` );
            } else {
                console.error( `http_server\tUnexpected error while handling request: ${ error }` );
                console.debug( 'http_server\t', error );
            }
        }
    }
}
