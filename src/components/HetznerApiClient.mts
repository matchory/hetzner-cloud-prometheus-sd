import fetch, { Request, Response } from 'node-fetch';
import { HttpClientError } from '../errors/Worker/HttpClientError.mjs';
import { measureDuration } from '../utilities.mjs';

export const DEFAULT_BASE_URL: URL = new URL( 'https://api.hetzner.cloud/v1/' );

export class HetznerApiClient
{
    private readonly token: string;

    private readonly baseUrl: string | URL;

    public constructor( token: string, baseUrl: string | URL = DEFAULT_BASE_URL ) {
        this.token   = token;
        this.baseUrl = baseUrl;
    }

    public async listServers(
        name: string | undefined                          = undefined,
        label: string | undefined                         = undefined,
        status: ServerStatus | ServerStatus[] | undefined = undefined,
    ): Promise<Server[]> {
        const options: Partial<ListServersParameters> = {

            // Sort by ID, so any added servers during page assembly will be
            // placed at the end, not interfering with stitching pages.
            sort: [ 'id:asc' ],
        };

        if ( name ) {
            console.debug( `hetzner_api\tFiltering servers by name on "${ name }"` );
            options.name = name;
        }

        if ( label ) {
            console.debug( `hetzner_api\tFiltering servers by name on "${ label }"` );
            options.label_selector = label;
        }

        if ( status ) {
            console.debug( `hetzner_api\tFiltering servers by name on "${ status }"` );
            options.status = Array.isArray( status ) ? status : [ status ];
        }

        let allServers: Server[]    = [];
        let nextPage: number | null = 1;
        const pageSize: number      = 50;

        do {
            if ( nextPage > 1 ) {
                console.debug(
                    `hetzner_api\tResult contains multiple pages. Fetching page ${ nextPage }...`,
                );
            }

            const response: ListServersResponse = await this.getRequest<ListServersResponse>(
                'servers',
                {
                    ...options,
                    page: nextPage.toString(),
                    per_page: pageSize.toString(),
                },
            );

            const servers        = response.servers;
            const { pagination } = response.meta;

            allServers = allServers.concat( servers );
            nextPage   = pagination.next_page;
        } while ( nextPage !== null );

        console.debug( `hetzner_api\tFetched ${ allServers.length } servers` );

        return allServers;
    }

    private async getRequest<T extends HetznerResponseBody = HetznerResponseBody>(
        uri: string,
        queryParameters: Record<string, string | string[]> = {},
        headers: Record<string, string>                    = {},
    ): Promise<T> {
        const response: Response = await this.apiRequest(
            'get',
            uri,
            undefined,
            queryParameters,
            headers,
        );

        return await response.json() as T;
    }

    private async apiRequest(
        method: 'get' | 'delete' | 'head',
        uri: URL | string,
        body: undefined,
        queryParameters: Record<string, string | string[]> | undefined,
        headers: Record<string, string> | undefined,
    ): Promise<Response>;

    private async apiRequest(
        method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head',
        uri: URL | string,
        body: Record<string, any> | undefined                          = undefined,
        queryParameters: Record<string, string | string[]> | undefined = undefined,
        headers: Record<string, string> | undefined                    = undefined,
    ): Promise<Response> {
        const url: URL = this.applyQueryParams(
            new URL( uri, this.baseUrl ),
            queryParameters || {},
        );

        console.debug( `hetzner_api\tDispatching request to ${ url }` );

        const request: Request = new Request( url.toString(), {
            method,
            headers: {
                ...( headers || {} ),
                'Authorization': `Bearer ${ this.token }`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify( body ),
        } );
        let duration: bigint;
        let response: Response;

        try {
            [ duration, response ] = await measureDuration( () => fetch( request ) );
        } catch ( error ) {
            if ( !( error instanceof Error ) ) {
                throw new Error( error as string );
            }

            throw new HttpClientError( error, request );
        }

        // TODO: Handle rate limit using headers:
        //       const max: number       = Number(response.headers.get('ratelimit-limit'));
        //       const remaining: number = Number(response.headers.get('ratelimit-remaining'));
        //       const reset: Date       = new Date(Number(response.headers.get('ratelimit-reset')) * 1_000);

        const responseId = response.headers.get( 'x-correlation-id' );

        console.debug( `hetzner_api\tReceived response #${ responseId } for ${ url } after ${ duration }ms` );

        if ( !isSuccessfulResponse( response ) ) {
            const message = `Request to ${ url } failed with status ${ response.status }: ${ response.statusText }`;

            throw new HttpClientError(
                new Error( message ),
                request,
                response,
            );
        }

        return response;
    }

    private applyQueryParams( url: URL, params: Record<string, string | string[]> ): URL {
        const entries = Object.entries( params || {} );

        for ( let [ key, values ] of entries ) {
            if ( !Array.isArray( values ) ) {
                values = [ values ];
            }

            for ( const value of values ) {
                url.searchParams.append( key, value );
            }
        }

        return url;
    }
}

function isSuccessfulResponse( response: Response ): boolean {
    return response.status > 199 && response.status < 300;
}

export interface Server
{
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
        }
        name: string;
        server_types: {
            available: number[];
            available_for_migration: number[];
            supported: number[];
        }
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
        os_version: string | null
        protection: {
            delete: boolean
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

interface ListServersResponse extends HetznerResponseBody
{
    servers: Array<Server>;
}

interface ListServersParameters
{
    // Can be used to filter resources by their name.
    // The response will only contain the resources matching the specified name.
    name: string;

    // Can be used to filter resources by labels.
    // The response will only contain resources matching the label selector.
    label_selector: string;

    sort: Array<'id' | 'id:asc' | 'id:desc' | 'name' | 'name:asc' | 'name:desc' | 'created' | 'created:asc' | 'created:desc'>;

    // Can be used multiple times. The response will only contain Server matching the status
    status: Array<ServerStatus>;
}

type ServerStatus = 'initializing' | 'starting' | 'running' | 'stopping' | 'off' | 'deleting' | 'rebuilding' | 'migrating' | 'unknown';

interface HetznerResponseBody extends Record<string, any>
{
    meta: {
        pagination: {
            last_page: number | null;
            next_page: number | null;
            page: number | null;
            per_page: number | null;
            previous_page: number | null;
            total_entries: number | null;
        }
    };
}
