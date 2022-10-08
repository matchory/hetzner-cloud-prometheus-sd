import ipRangeCheck from 'ip-range-check';
import { groupBy } from '../utilities.mjs';
export const targets = (config, dataStore) => {
    const labels = {
        data_center: labelName(config, 'data_center'),
        image: labelName(config, 'image'),
        image_type: labelName(config, 'image_type'),
        location: labelName(config, 'location'),
        location_city: labelName(config, 'location_city'),
        location_country: labelName(config, 'location_country'),
        name: labelName(config, 'name'),
        os_flavor: labelName(config, 'os_flavor'),
        os_version: labelName(config, 'os_version'),
        placement_group: labelName(config, 'placement_group'),
        public_ipv4: labelName(config, 'public_ipv4'),
        public_ipv6: labelName(config, 'public_ipv6'),
        server_cpu_cores: labelName(config, 'server_cpu_cores'),
        server_cpu_type: labelName(config, 'server_cpu_type'),
        server_disk: labelName(config, 'server_disk'),
        server_memory: labelName(config, 'server_memory'),
        server_storage: labelName(config, 'server_storage'),
        server_type: labelName(config, 'server_type'),
        status: labelName(config, 'status'),
        _labelPrefix: labelName(config, 'label_'),
    };
    return function targetsRouteHandler(request, response) {
        // Response status code MUST be 200
        response.writeHead(200);
        // If there are no servers available yet, an empty list MUST be given
        const servers = dataStore.getServers() || [];
        const payload = format(config, labels, servers);
        response.end(config.debug
            ? JSON.stringify(payload, null, 4)
            : JSON.stringify(payload));
        return response;
    };
};
function format(config, labels, servers) {
    const targets = servers
        .map((server) => [
        resolveIp(config, server),
        server,
    ])
        .filter((tuple) => !!tuple[0])
        .map(([ip, server]) => ({
        targets: [resolveTarget(config, ip)],
        labels: {
            [labels.data_center]: server.datacenter.name,
            [labels.image]: server.image?.name || 'unknown',
            [labels.image_type]: server.image?.type || server.image?.description || 'unknown',
            [labels.location]: server.datacenter.location.name,
            [labels.location_city]: server.datacenter.location.city,
            [labels.location_country]: server.datacenter.location.country,
            [labels.name]: server.name,
            [labels.os_flavor]: server.image?.os_flavor || 'unknown',
            [labels.os_version]: server.image?.os_version || 'unknown',
            [labels.placement_group]: server.placement_group?.name || 'none',
            [labels.public_ipv4]: server.public_net.ipv4?.ip || 'none',
            [labels.public_ipv6]: server.public_net.ipv6?.ip || 'none',
            [labels.server_cpu_cores]: server.server_type.cores.toString(),
            [labels.server_cpu_type]: server.server_type.cpu_type,
            [labels.server_disk]: server.server_type.disk.toString(),
            [labels.server_memory]: server.server_type.memory.toString(),
            [labels.server_storage]: server.server_type.storage_type,
            [labels.server_type]: server.server_type.name,
            [labels.status]: server.status,
            ...Object
                .entries(server.labels)
                .map(([key, value]) => [
                labels._labelPrefix + key.replace(/[._-]+/g, '_'),
                value,
            ])
                .reduce((carry, [key, value]) => ({
                [key]: value,
            }), {}),
        },
    }));
    // Group servers with identical labels
    const grouped = groupBy(targets, target => Object.values(target.labels).join());
    return Object
        .values(grouped)
        .reduce((carry, targets) => ([
        ...carry,
        {
            targets: targets.flatMap(list => list.targets),
            labels: targets.shift()?.labels || {},
        },
    ]), []);
}
function resolveIp(config, server) {
    if (config.nodeNetwork) {
        const address = server.private_net.find(({ network, ip }) => (config.nodeNetwork && (network.toString() === config.nodeNetwork ||
            ipRangeCheck(ip, config.nodeNetwork))));
        if (address) {
            return address.ip;
        }
    }
    return server.public_net.ipv4?.ip || server.public_net.ipv6?.ip;
}
function labelName(config, key) {
    return `__meta_${config.nodeLabelPrefix}_${key}`;
}
function resolveTarget(config, ip) {
    const metricsPort = config.nodePort;
    return `${ip}:${metricsPort}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZUhhbmRsZXJzL3RhcmdldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxZQUFZLE1BQU0sZ0JBQWdCLENBQUM7QUFJMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTNDLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxDQUFFLE1BQWMsRUFBRSxTQUE4QixFQUFvQixFQUFFO0lBQ3pGLE1BQU0sTUFBTSxHQUFHO1FBQ1gsV0FBVyxFQUFFLFNBQVMsQ0FBRSxNQUFNLEVBQUUsYUFBYSxDQUFFO1FBQy9DLEtBQUssRUFBRSxTQUFTLENBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBRTtRQUNuQyxVQUFVLEVBQUUsU0FBUyxDQUFFLE1BQU0sRUFBRSxZQUFZLENBQUU7UUFDN0MsUUFBUSxFQUFFLFNBQVMsQ0FBRSxNQUFNLEVBQUUsVUFBVSxDQUFFO1FBQ3pDLGFBQWEsRUFBRSxTQUFTLENBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBRTtRQUNuRCxnQkFBZ0IsRUFBRSxTQUFTLENBQUUsTUFBTSxFQUFFLGtCQUFrQixDQUFFO1FBQ3pELElBQUksRUFBRSxTQUFTLENBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBRTtRQUNqQyxTQUFTLEVBQUUsU0FBUyxDQUFFLE1BQU0sRUFBRSxXQUFXLENBQUU7UUFDM0MsVUFBVSxFQUFFLFNBQVMsQ0FBRSxNQUFNLEVBQUUsWUFBWSxDQUFFO1FBQzdDLGVBQWUsRUFBRSxTQUFTLENBQUUsTUFBTSxFQUFFLGlCQUFpQixDQUFFO1FBQ3ZELFdBQVcsRUFBRSxTQUFTLENBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBRTtRQUMvQyxXQUFXLEVBQUUsU0FBUyxDQUFFLE1BQU0sRUFBRSxhQUFhLENBQUU7UUFDL0MsZ0JBQWdCLEVBQUUsU0FBUyxDQUFFLE1BQU0sRUFBRSxrQkFBa0IsQ0FBRTtRQUN6RCxlQUFlLEVB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