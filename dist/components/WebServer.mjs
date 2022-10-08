import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { hrtime } from 'node:process';
import client from 'prom-client';
import { ClosedConnectionError } from '../errors/ClosedConnectionError.mjs';
import { MethodNotAllowedError } from '../errors/MethodNotAllowedError.mjs';
import { NotFoundError } from '../errors/NotFoundError.mjs';
import { error } from '../routeHandlers/error.js';
import { metrics } from '../routeHandlers/metrics.js';
import { targets } from '../routeHandlers/targets.js';
import { measureDuration } from '../utilities.mjs';
export class WebServer {
    config;
    dataStore;
    metricsHandler = null;
    targetsHandler = null;
    errorHandler = null;
    responseTimeMetric;
    constructor(config, dataStore) {
        this.config = config;
        this.dataStore = dataStore;
        this.responseTimeMetric = new client.Histogram({
            help: 'Duration of requests to the web server',
            name: 'response_time',
            labelNames: ['path', 'method', 'status'],
        });
    }
    async start() {
        const hostname = this.config.hostname;
        const port = this.config.port;
        const server = this.config.https
            ? this.startHttpsServer()
            : this.startHttpServer();
        this.metricsHandler = metrics(this.config, this.dataStore);
        this.targetsHandler = targets(this.config, this.dataStore);
        this.errorHandler = error(this.config, this.dataStore);
        server.listen(port, hostname, () => this.onListening(hostname, port));
    }
    startHttpServer() {
        return createHttpServer({}, this.onRequest.bind(this));
    }
    startHttpsServer() {
        const options = {};
        if (this.config.mTlsCa) {
            options.requestCert = true;
            options.rejectUnauthorized = true;
            options.ca = this.config.mTlsCa;
        }
        return createHttpsServer(options, this.onRequest.bind(this));
    }
    onListening(hostname, port) {
        console.info(`http_server\tserver is running at http://${hostname}:${port}`);
    }
    async onRequest(request, response) {
        const path = request.url?.split('?', 2).shift();
        let duration;
        try {
            [duration] = await measureDuration(start => new Promise(async (resolve, reject) => {
                // Resolve as soon as the request has been sent completely
                response.addListener('finish', () => resolve(response));
                // Handle closed connections properly
                response.addListener('close', () => reject(new ClosedConnectionError(hrtime.bigint() - start)));
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                // Reject any request methods but GET (or HEAD)
                if (!['GET', 'HEAD'].includes(request.method?.toUpperCase() || '') &&
                    this.errorHandler) {
                    return this.errorHandler(request, response, new MethodNotAllowedError(['GET']));
                }
                try {
                    switch (path) {
                        case this.config.metricsEndpoint:
                            return this.metricsHandler && await this.metricsHandler(request, response);
                        case '/sd':
                            return this.targetsHandler && await this.targetsHandler(request, response);
                        default:
                            throw new NotFoundError(path || '/');
                    }
                }
                catch (error) {
                    console.error(`http_server\tError while handling request: ${error}`);
                    console.debug('http_server\t', error);
                    if (error instanceof Error && this.errorHandler) {
                        await this.errorHandler(request, response, error);
                        return;
                    }
                    throw error;
                }
            }));
            this.responseTimeMetric.observe({
                status: response.statusCode,
                method: request.method,
                path: path,
            }, Number(duration));
            console.info(`http_server\t${response.statusCode}\t${request.method} ${request.url} HTTP/${request.httpVersion}\t${duration}ms`);
        }
        catch (error) {
            if (error instanceof ClosedConnectionError) {
                console.error(`http_server\t499\t${request.method} ${request.url} HTTP/${request.httpVersion}\t${error}`);
            }
            else {
                console.error(`http_server\tUnexpected error while handling request: ${error}`);
                console.debug('http_server\t', error);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViU2VydmVyLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1dlYlNlcnZlci5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksSUFBSSxnQkFBZ0IsRUFBMEUsTUFBTSxNQUFNLENBQUM7QUFDaEksT0FBTyxFQUFFLFlBQVksSUFBSSxpQkFBaUIsRUFBd0MsTUFBTSxPQUFPLENBQUM7QUFDaEcsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLE1BQXFCLE1BQU0sYUFBYSxDQUFDO0FBQ2hELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsS0FBSyxFQUF3QixNQUFNLDJCQUEyQixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBS25ELE1BQU0sT0FBTyxTQUFTO0lBRUQsTUFBTSxDQUFTO0lBRWYsU0FBUyxDQUFzQjtJQUV4QyxjQUFjLEdBQTJCLElBQUksQ0FBQztJQUU5QyxjQUFjLEdBQTJCLElBQUksQ0FBQztJQUU5QyxZQUFZLEdBQWdDLElBQUksQ0FBQztJQUVqRCxrQkFBa0IsQ0FBMEM7SUFFcEUsWUFBb0IsTUFBYyxFQUFFLFNBQThCO1FBQzlELElBQUksQ0FBQyxNQUFNLEdBQU0sTUFBTSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRTNCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLE1BQU0s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