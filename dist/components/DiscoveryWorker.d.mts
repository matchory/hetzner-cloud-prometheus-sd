import { Gauge, Histogram } from 'prom-client';
import { Config } from './Config.mjs';
import { DataStore } from './DataStore.mjs';
import { Server } from './HetznerApiClient.mjs';
export declare class DiscoveryWorker {
    private config;
    private client;
    private dataStore;
    private pendingSyncTimer;
    pendingSync: Promise<void> | null;
    syncDurationMetric: Histogram;
    serverCountMetric: Gauge;
    constructor(config: Config, dataStore: DataStore<Server[]>);
    private fetch;
    private update;
    private sync;
    start(): Promise<void>;
}
