import { EventEmitter } from 'events';
import { Config } from './Config.mjs';

export class DataStore<T = unknown> extends EventEmitter
{
    config: Config;

    data: T | null = null;

    constructor( config: Config ) {
        super();

        this.config = config;
    }

    public getServers(): T | null {
        return this.data;
    }

    public async updateServers( data: T ): Promise<void> {
        await this.persist( data );
        this.emit( 'update', { data } );
    }

    protected async persist( data: T ): Promise<void> {
        this.data = data;
        this.emit( 'persist', { data } );
    }

    public async restore(): Promise<void> {
        // no-op
    }
}
