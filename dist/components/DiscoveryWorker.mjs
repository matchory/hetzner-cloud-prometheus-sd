import client from 'prom-client';
import { AuthenticationError } from '../errors/Worker/AuthenticationError.mjs';
import { HttpClientError } from '../errors/Worker/HttpClientError.mjs';
import { measureDuration } from '../utilities.mjs';
import { HetznerApiClient } from './HetznerApiClient.mjs';
export class DiscoveryWorker {
    config;
    client;
    dataStore;
    pendingSyncTimer = undefined;
    pendingSync = null;
    syncDurationMetric;
    serverCountMetric;
    constructor(config, dataStore) {
        this.config = config;
        this.dataStore = dataStore;
        this.client = new HetznerApiClient(config.hetznerApiToken);
        this.syncDurationMetric = new client.Histogram({
            help: 'Duration of synchronisation with the Hetzner API',
            name: 'sync_duration',
        });
        this.serverCountMetric = new client.Gauge({
            help: 'Current number of servers in the project',
            name: 'server_count',
        });
    }
    async fetch() {
        console.debug('discovery\tFetching servers');
        let duration;
        let servers;
        try {
            [duration, servers] = await measureDuration(() => this.client.listServers());
        }
        catch (error) {
            if (error instanceof HttpClientError && [401, 403].includes(error.status)) {
                throw new AuthenticationError();
            }
            throw error;
        }
        console.debug(`discovery\tFetched ${servers.length} servers in ${duration}ms`);
        this.syncDurationMetric.observe(Number(duration) / 1_000);
        return servers;
    }
    async update(servers) {
        console.debug(`discovery\tPersisting ${servers.length} servers in data store`);
        await this.dataStore.updateServers(servers);
        this.serverCountMetric.set(servers.length);
    }
    async sync() {
        console.debug('discovery\tCommencing sync');
        const interval = this.config.refreshInterval;
        const data = await this.fetch();
        await this.update(data);
        // Schedule the next sync
        this.pendingSyncTimer = setTimeout(() => this.pendingSync = this.sync(), interval);
        console.debug(`discovery\tScheduling next sync in ${interval}ms`);
    }
    async start() {
        console.debug('discovery\tStarting discovery worker');
        return this.sync();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY292ZXJ5V29ya2VyLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0Rpc2NvdmVyeVdvcmtlci5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUE0QixNQUFNLGFBQWEsQ0FBQztBQUN2RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR25ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBVSxNQUFNLHdCQUF3QixDQUFDO0FBRWxFLE1BQU0sT0FBTyxlQUFlO0lBRWhCLE1BQU0sQ0FBUztJQUVmLE1BQU0sQ0FBbUI7SUFFekIsU0FBUyxDQUFzQjtJQUUvQixnQkFBZ0IsR0FBNkIsU0FBUyxDQUFDO0lBRS9ELFdBQVcsR0FBeUIsSUFBSSxDQUFDO0lBRXpDLGtCQUFrQixDQUFZO0lBQzlCLGlCQUFpQixDQUFRO0lBRXpCLFlBQW9CLE1BQWMsRUFBRSxTQUE4QjtRQUM5RCxJQUFJLENBQUMsTUFBTSxHQUFNLE1BQU0sQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFNLElBQUksZ0JBQWdCLENBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBRSxDQUFDO1FBRWhFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUU7WUFDNUMsSUFBSSxFQUFFLGtEQUFrRDtZQUN4RCxJQUFJLEVBQUUsZUFBZTtTQUN4QixDQUFFLENBQUM7UUFDSixJQUFJLENBQUMsaUJBQWlCLEdBQUksSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFFO1lBQ3hDLElBQUksRUFBRSwwQ0FBMEM7WUFDaEQsSUFBSSxFQUFFLGNBQWM7U0FDdkIsQ0FBRSxDQUFDO0lBQ1IsQ0FBQztJQUVPLEtBQUssQ0FBQyxLQUFLO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBRSw2QkFBNkIsQ0FBRSxDQUFDO1FBRS9DLElBQUksUUFBZ0IsQ0FBQztRQUNyQixJQUFJLE9BQWlCLENBQUM7UUFFdEIsSUFBSTtZQUNBLENBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBRSxHQUFHLE1BQU0sZUFBZSxDQUN6QyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUNsQyxDQUFDO1NBQ0w7UUFBQyxPQUFRLEtBQUssRUFBRztZQUNkLElBQUssS0FBSyxZQUFZLGVBQWUsSUFBSSxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUUsQ0FBQyxRQUFRLENBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBRSxFQUFHO2dCQUM3RSxNQUFNLElBQUksbUJBQW1CLEVBQUUsQ0FBQzthQUNuQztZQUVELE1BQU0sS0FBSyxDQUFDO1NBQ2Y7UUFFRCxPQUFPLENBQUMsS0FBSyxDQUFFLHNCQUF1QixPQUFPLENBQUMsTUFBTyxlQUFnQixRQUFTLElBQUksQ0FBRSxDQUFDO1FBRXJGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFFLFFBQVEsQ0FBRSxHQUFHLEtBQUssQ0FBRSxDQUFDO1FBRTlELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTyxLQUFLLENBQUMsTUFBTSxDQUFFLE9BQWlCO1FBQ25DLE9BQU8sQ0FBQyxLQUFLLENBQUUseUJBQTBCLE9BQU8sQ0FBQyxNQUFPLHdCQUF3QixDQUFFLENBQUM7UUFDbkYsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBRSxPQUFPLENBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRU8sS0FBSyxDQUFDLElBQUk7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFFLDRCQUE0QixDQUFFLENBQUM7UUFFOUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQU8sTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFcEMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFFLElBQUksQ0FBRSxDQUFDO1FBRTFCLHlCQUF5QjtRQUN6QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUM5QixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFDcEMsUUFBUSxDQUNYLENBQUM7UUFFRixPQUFPLENBQUMsS0FBSyxDQUFFLHNDQUF1QyxRQUFTLElBQUksQ0FBRSxDQUFDO0lBQzFFLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBSztRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUUsc0NBQXNDLENBQUUsQ0FBQztRQUN4RCxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDO0NBQ0oifQ==