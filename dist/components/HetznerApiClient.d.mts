export declare const DEFAULT_BASE_URL: URL;
export declare class HetznerApiClient {
    private readonly token;
    private readonly baseUrl;
    constructor(token: string, baseUrl?: string | URL);
    listServers(name?: string | undefined, label?: string | undefined, status?: ServerStatus | ServerStatus[] | undefined): Promise<Server[]>;
    private getRequest;
    private apiRequest;
    private applyQueryParams;
}
export interface Server {
    backup_window: string | null;
    created: string | null;
    datacenter: {
        description: string;
        id: number;
        location: {
            city: string;
            country: string;
            description: string;
            id: number;
            latitude: number;
            longitude: number;
            name: string;
            network_zone: string;
        };
        name: string;
        server_types: {
            available: number[];
            available_for_migration: number[];
            supported: number[];
        };
    };
    id: number;
    image: {
        bound_to: number | null;
        created: string;
        created_from: {
            id: number;
            name: string;
        } | null;
        deleted: string | null;
        deprecated: string | null;
        description: string;
        disk_size: number;
        id: number;
        image_size: number | null;
        labels: Record<string, string>;
        name: string | null;
        os_flavor: 'ubuntu' | 'centos' | 'debian' | 'fedora' | 'unknown';
        os_version: string | null;
        protection: {
            delete: boolean;
        };
        rapid_deploy: boolean;
        status: 'available' | 'creating' | 'unavailable';
        type: 'system' | 'app' | 'snapshot' | 'backup' | 'temporary';
    } | null;
    included_traffic: number | null;
    ingoing_traffic: number | null;
    iso: {
        deprecated: string | null;
        description: string;
        id: number;
        name: string | null;
        type: 'public' | 'private';
    } | null;
    labels: Record<string, string>;
    load_balancers: number[];
    locked: boolean;
    name: string;
    outgoing_traffic: number | null;
    placement_group: {
        created: string;
        id: number;
        labels: Record<string, string>;
        name: string;
        servers: number[];
        type: 'spread';
    } | null;
    primary_disk_size: number;
    private_net: Array<{
        alias_ips: string[];
        ip: string;
        mac_address: string;
        network: number;
    }>;
    protection: {
        delete: boolean;
        rebuild: boolean;
    };
    public_net: {
        firewalls: Array<{
            id: number;
            status: 'applied' | 'pending';
        }>;
        floating_ips: number[];
        ipv4: {
            blocked: boolean;
            dns_ptr: string;
            id: number;
            ip: string;
        } | null;
        ipv6: {
            blocked: boolean;
            dns_ptr: Array<{
                dns_ptr: string;
                ip: string;
            }> | null;
            id: number;
            ip: string;
        } | null;
    };
    rescue_enabled: boolean;
    server_type: {
        cores: number;
        cpu_type: 'shared' | 'dedicated';
        deprecated: boolean;
        description: string;
        disk: number;
        id: number;
        memory: number;
        name: string;
        prices: Array<{
            location: string;
            price_hourly: {
                gross: string;
                net: string;
            };
            price_monthly: {
                gross: string;
                net: string;
            };
        }>;
        storage_type: 'local' | 'network';
    };
    status: ServerStatus;
    volumes: number[];
}
declare type ServerStatus = 'initializing' | 'starting' | 'running' | 'stopping' | 'off' | 'deleting' | 'rebuilding' | 'migrating' | 'unknown';
export {};
