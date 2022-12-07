import process from 'node:process';
import client from 'prom-client';
import yargs from 'yargs/yargs';
import { Config, options, ProcessArgs } from './components/Config.mjs';
import { DataStore } from './components/DataStore.mjs';
import { DiscoveryWorker } from './components/DiscoveryWorker.mjs';
import { Server } from './components/HetznerApiClient.mjs';
import { WebServer } from './components/WebServer.mjs';
import { setup } from './logging.mjs';

const argv: string[] = process.argv.slice( 2 );
const input          = yargs( argv )
.options( options )
.env('HETZNER_SD')
.strict()
.parseSync();

main( input ).catch( error => console.error( 'Unexpected error:', error ) );

async function main( processedInput: ProcessArgs ): Promise<void> {
    const config = new Config( processedInput );

    try {
        config.validate();
    } catch ( error ) {
        if ( !( error instanceof Error ) ) {
            throw error;
        }

        console.error( `Invalid configuration: ${ error.message }` );
        process.exit( 2 );
    }

    setup( config.logLevel );
    client.collectDefaultMetrics( {} );

    const dataStore = new DataStore<Server[]>( config );
    const worker    = new DiscoveryWorker( config, dataStore );
    const server    = new WebServer( config, dataStore );

    try {
        await Promise.all( [
            server.start(),
            worker.start(),
        ] );
    } catch ( error ) {
        if ( !( error instanceof Error ) ) {
            console.error( `main\t\tUnexpected error: ${ error }:`, { error } );
            process.exit( 1 );
        }

        console.error( `main\t\tStartup error: ${ error.message }` );
        process.exit( 1 );
    }
}

