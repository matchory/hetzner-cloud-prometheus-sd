import { RequestListener } from 'http';
import ipRangeCheck from 'ip-range-check';
import { Config } from '../components/Config.mjs';
import { DataStore } from '../components/DataStore.mjs';
import { Server } from '../components/HetznerApiClient.mjs';
import { groupBy } from '../utilities.mjs';

export const targets = ( config: Config, dataStore: DataStore<Server[]> ): RequestListener => {
    const labels = {
        data_center: labelName( config, 'data_center' ),
        image: labelName( config, 'image' ),
        image_type: labelName( config, 'image_type' ),
        location: labelName( config, 'location' ),
        location_city: labelName( config, 'location_city' ),
        location_country: labelName( config, 'location_country' ),
        name: labelName( config, 'name' ),
        os_flavor: labelName( config, 'os_flavor' ),
        os_version: labelName( config, 'os_version' ),
        placement_group: labelName( config, 'placement_group' ),
        public_ipv4: labelName( config, 'public_ipv4' ),
        public_ipv6: labelName( config, 'public_ipv6' ),
        server_cpu_cores: labelName( config, 'server_cpu_cores' ),
        server_cpu_type: labelName( config, 'server_cpu_type' ),
        server_disk: labelName( config, 'server_disk' ),
        server_memory: labelName( config, 'server_memory' ),
        server_storage: labelName( config, 'server_storage' ),
        server_type: labelName( config, 'server_type' ),
        status: labelName( config, 'status' ),
        _labelPrefix: labelName( config, 'label_' ),
    };

    return function targetsRouteHandler( request, response ) {
        // Response status code MUST be 200
        response.writeHead( 200 );

        // If there are no servers available yet, an empty list MUST be given
        const servers = dataStore.getServers() || [];
        const payload = format(
            config,
            labels,
            servers,
        );

        response.end(
            config.debug
            ? JSON.stringify( payload, null, 4 )
            : JSON.stringify( payload ),
        );

        return response;
    };
};

function format<T extends Record<string, string>>(
    config: Config,
    labels: T,
    servers: Server[],
): TargetList<T>[] {
    const targets = servers
    .map( ( server ) => [
        resolveIp( config, server ),
        server,
    ] )
    .filter( ( tuple ): tuple is [ string, Server ] => !!tuple[ 0 ] )
    .map( ( [ ip, server ] ): TargetList<T> => ( {
        targets: [ resolveTarget( config, ip ) ],
        labels: {
            [ labels.data_center ]: server.datacenter.name,
            [ labels.image ]: server.image?.name || 'unknown',
            [ labels.image_type ]: server.image?.type || server.image?.description || 'unknown',
            [ labels.location ]: server.datacenter.location.name,
            [ labels.location_city ]: server.datacenter.location.city,
            [ labels.location_country ]: server.datacenter.location.country,
            [ labels.name ]: server.name,
            [ labels.os_flavor ]: server.image?.os_flavor || 'unknown',
            [ labels.os_version ]: server.image?.os_version || 'unknown',
            [ labels.placement_group ]: server.placement_group?.name || 'none',
            [ labels.public_ipv4 ]: server.public_net.ipv4?.ip || 'none',
            [ labels.public_ipv6 ]: server.public_net.ipv6?.ip || 'none',
            [ labels.server_cpu_cores ]: server.server_type.cores.toString(),
            [ labels.server_cpu_type ]: server.server_type.cpu_type,
            [ labels.server_disk ]: server.server_type.disk.toString(),
            [ labels.server_memory ]: server.server_type.memory.toString(),
            [ labels.server_storage ]: server.server_type.storage_type,
            [ labels.server_type ]: server.server_type.name,
            [ labels.status ]: server.status,

            ...Object
            .entries( server.labels )
            .map( ( [ key, value ] ) => [
                labels._labelPrefix + key.replace( /[._-]+/g, '_' ),
                value,
            ] )
            .reduce( ( carry, [ key, value ] ) => ( {
                [ key ]: value,
            } ), {} ),
        },
    } ) );

    // Group servers with identical labels
    const grouped = groupBy(
        targets,
        target => Object.values( target.labels ).join(),
    );

    return Object
    .values( grouped )
    .reduce( ( carry, targets ) => ( [
        ...carry,
        {
            targets: targets.flatMap( list => list.targets ),
            labels: targets.shift()?.labels || {} as T,
        },
    ] ), [] as TargetList<T>[] );
}

function resolveIp( config: Config, server: Server ): string | undefined {
    if ( config.nodeNetwork ) {
        const address = server.private_net.find( ( { network, ip } ) => (
            config.nodeNetwork && (
                network.toString() === config.nodeNetwork ||
                ipRangeCheck( ip, config.nodeNetwork )
            )
        ) );

        if ( address ) {
            return address.ip;
        }
    }

    return server.public_net.ipv4?.ip || server.public_net.ipv6?.ip;
}

function labelName( config: Config, key: string ): string {
    return `__meta_${ config.nodeLabelPrefix }_${ key }`;
}

function resolveTarget( config: Config, ip: string ): string {
    const metricsPort = config.nodePort;

    return `${ ip }:${ metricsPort }`;
}

interface TargetList<T extends Record<string, string>>
{
    targets: string[];
    labels: Partial<T>;
}
