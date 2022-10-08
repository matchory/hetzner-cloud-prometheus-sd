import { IncomingMessage, ServerResponse } from 'http';
import { Config } from '../components/Config.mjs';
import { DataStore } from '../components/DataStore.mjs';
import { Server } from '../components/HetznerApiClient.mjs';
import { HttpError } from '../errors/HttpError.mjs';

export type ErrorRequestListener = ( request: IncomingMessage, response: ServerResponse, error?: Error ) => void | Promise<void>;

export const error = ( config: Config, dataStore: DataStore<Server[]> ): ErrorRequestListener => {
    return function errorRouteHandler(
        request,
        response,
        error,
    ) {
        const payload: ErrorPayload = {
            errors: [
                {
                    title: error?.message || 'Unknown error',
                },
            ],
        };

        if ( config.debug ) {
            payload.errors[ 0 ].meta = {
                stack: error?.stack
                            ?.split( '\n' )
                            ?.map( line => line.trim() ),
            };
        }

        response.statusCode = error && error instanceof HttpError && error.status || 500;

        if ( error && error instanceof HttpError ) {
            if ( error.detail ) {
                payload.errors[ 0 ].detail = error.detail;
            }

            for ( const [ key, values ] of Object.entries( error.headers ) ) {
                for ( let value of values ) {
                    response.setHeader( key, value );
                }
            }
        }

        response.end(
            config.debug
            ? JSON.stringify( payload, null, 4 )
            : JSON.stringify( payload ),
        );
    };
};

export interface ErrorPayload
{
    errors: ErrorRepresentation[];
}

interface ErrorRepresentation
{
    code?: string;
    title: string;
    detail?: string;
    source?: {
        pointer: string;
    };
    meta?: {
        stack?: string[];
    };
}
