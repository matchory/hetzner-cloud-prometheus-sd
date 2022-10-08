import { RequestListener } from 'http';
import client from 'prom-client';
import { Config } from '../components/Config.mjs';
import { DataStore } from '../components/DataStore.mjs';
import { Server } from '../components/HetznerApiClient.mjs';

export const metrics = ( config: Config, dataStore: DataStore<Server[]> ): RequestListener => {
    return async function metricsRouteHandler(
        request,
        response,
    ) {
        const payload = await client.register.metrics();

        response.removeHeader( 'Content-Type' );
        response.setHeader( 'Content-Type', 'text/plain' );
        response.end( payload );
    };
};
