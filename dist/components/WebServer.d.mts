import { Config } from './Config.mjs';
import { DataStore } from './DataStore.mjs';
import { Server } from './HetznerApiClient.mjs';
export declare class WebServer {
    private readonly config;
    private readonly dataStore;
    private metricsHandler;
    private targetsHandler;
    private errorHandler;
    private responseTimeMetric;
    constructor(config: Config, dataStore: DataStore<Server[]>);
    start(): Promise<void>;
    private startHttpServer;
    private startHttpsServer;
    private onListening;
    private onRequest;
}
