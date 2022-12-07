import client, { Gauge, Histogram } from 'prom-client';
import { AuthenticationError } from '../errors/Worker/AuthenticationError.mjs';
import { HttpClientError } from '../errors/Worker/HttpClientError.mjs';
import { measureDuration } from '../utilities.mjs';
import { Config } from './Config.mjs';
import { DataStore } from './DataStore.mjs';
import { HetznerApiClient, Server } from './HetznerApiClient.mjs';

export class DiscoveryWorker
{
    private config: Config;

    private client: HetznerApiClient;

    private dataStore: DataStore<Server[]>;

    private pendingSyncTimer: NodeJS.Timer | undefined = undefined;

    pendingSync: Promise<void> | null = null;

    syncDurationMetric: Histogram;
    serverCountMetric: Gauge;

    public constructor( config: Config, dataStore: DataStore<Server[]> ) {
        this.config    = config;
        this.dataStore = dataStore;
        this.client    = new HetznerApiClient( config.apiToken );

        this.syncDurationMetric = new client.Histogram( {
            help: 'Duration of synchronisation with the Hetzner API',
            name: 'sync_duration',
        } );
        this.serverCountMetric  = new client.Gauge( {
            help: 'Current number of servers in the project',
            name: 'server_count',
        } );
    }

    private async fetch(): Promise<Server[]> {
        console.debug( 'discovery\tFetching servers' );

        let duration: bigint;
        let servers: Server[];

        try {
            [ duration, servers ] = await measureDuration(
                () => this.client.listServers(),
            );
        } catch ( error ) {
            if ( error instanceof HttpClientError && [ 401, 403 ].includes( error.status ) ) {
                throw new AuthenticationError();
            }

            throw error;
        }

        console.debug( `discovery\tFetched ${ servers.length } servers in ${ duration }ms` );

        this.syncDurationMetric.observe( Number( duration ) / 1_000 );

        return servers;
    }

    private async update( servers: Server[] ): Promise<void> {
        console.debug( `discovery\tPersisting ${ servers.length } servers in data store` );
        await this.dataStore.updateServers( servers );
        this.serverCountMetric.set( servers.length );
    }

    private async sync(): Promise<void> {
        console.debug( 'discovery\tCommencing sync' );

        const interval = this.config.refreshInterval;
        const data     = await this.fetch();

        await this.update( data );

        // Schedule the next sync
        this.pendingSyncTimer = setTimeout(
            () => this.pendingSync = this.sync(),
            interval,
        );

        console.debug( `discovery\tScheduling next sync in ${ interval }ms` );
    }

    public async start(): Promise<void> {
        console.debug( 'discovery\tStarting discovery worker' );
        return this.sync();
    }
}
