import fetch, { Request } from 'node-fetch';
import { HttpClientError } from '../errors/Worker/HttpClientError.mjs';
import { measureDuration } from '../utilities.mjs';
export const DEFAULT_BASE_URL = new URL('https://api.hetzner.cloud/v1/');
export class HetznerApiClient {
    token;
    baseUrl;
    constructor(token, baseUrl = DEFAULT_BASE_URL) {
        this.token = token;
        this.baseUrl = baseUrl;
    }
    async listServers(name = undefined, label = undefined, status = undefined) {
        const options = {
            // Sort by ID, so any added servers during page assembly will be
            // placed at the end, not interfering with stitching pages.
            sort: ['id:asc'],
        };
        if (name) {
            console.debug(`hetzner_api\tFiltering servers by name on "${name}"`);
            options.name = name;
        }
        if (label) {
            console.debug(`hetzner_api\tFiltering servers by name on "${label}"`);
            options.label_selector = label;
        }
        if (status) {
            console.debug(`hetzner_api\tFiltering servers by name on "${status}"`);
            options.status = Array.isArray(status) ? status : [status];
        }
        let allServers = [];
        let nextPage = 1;
        const pageSize = 50;
        do {
            if (nextPage > 1) {
                console.debug(`hetzner_api\tResult contains multiple pages. Fetching page ${nextPage}...`);
            }
            const response = await this.getRequest('servers', {
                ...options,
                page: nextPage.toString(),
                per_page: pageSize.toString(),
            });
            const servers = response.servers;
            const { pagination } = response.meta;
            allServers = allServers.concat(servers);
            nextPage = pagination.next_page;
        } while (nextPage !== null);
        console.debug(`hetzner_api\tFetched ${allServers.length} servers`);
        return allServers;
    }
    async getRequest(uri, queryParameters = {}, headers = {}) {
        const response = await this.apiRequest('get', uri, undefined, queryParameters, headers);
        return await response.json();
    }
    async apiRequest(method, uri, body = undefined, queryParameters = undefined, headers = undefined) {
        const url = this.applyQueryParams(new URL(uri, this.baseUrl), queryParameters || {});
        console.debug(`hetzner_api\tDispatching request to ${url}`);
        const request = new Request(url.toString(), {
            method,
            headers: {
                ...(headers || {}),
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });
        let duration;
        let response;
        try {
            [duration, response] = await measureDuration(() => fetch(request));
        }
        catch (error) {
            if (!(error instanceof Error)) {
                throw new Error(error);
            }
            throw new HttpClientError(error, request);
        }
        // TODO: Handle rate limit using headers:
        //       const max: number       = Number(response.headers.get('ratelimit-limit'));
        //       const remaining: number = Number(response.headers.get('ratelimit-remaining'));
        //       const reset: Date       = new Date(Number(response.headers.get('ratelimit-reset')) * 1_000);
        const responseId = response.headers.get('x-correlation-id');
        console.debug(`hetzner_api\tReceived response #${responseId} for ${url} after ${duration}ms`);
        if (!isSuccessfulResponse(response)) {
            const message = `Request to ${url} failed with status ${response.status}: ${response.statusText}`;
            throw new HttpClientError(new Error(message), request, response);
        }
        return response;
    }
    applyQueryParams(url, params) {
        const entries = Object.entries(params || {});
        for (let [key, values] of entries) {
            if (!Array.isArray(values)) {
                values = [values];
            }
            for (const value of values) {
                url.searchParams.append(key, value);
            }
        }
        return url;
    }
}
function isSuccessfulResponse(response) {
    return response.status > 199 && response.status < 300;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGV0em5lckFwaUNsaWVudC5tanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9IZXR6bmVyQXBpQ2xpZW50Lm10cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBWSxNQUFNLFlBQVksQ0FBQztBQUN0RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRW5ELE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFRLElBQUksR0FBRyxDQUFFLCtCQUErQixDQUFFLENBQUM7QUFFaEYsTUFBTSxPQUFPLGdCQUFnQjtJQUVSLEtBQUssQ0FBUztJQUVkLE9BQU8sQ0FBZTtJQUV2QyxZQUFvQixLQUFhLEVBQUUsVUFBd0IsZ0JBQWdCO1FBQ3ZFLElBQUksQ0FBQyxLQUFLLEdBQUssS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFTSxLQUFLLENBQUMsV0FBVyxDQUNwQixPQUFvRCxTQUFTLEVBQzdELFFBQW9ELFNBQVMsRUFDN0QsU0FBb0QsU0FBUztRQUU3RCxNQUFNLE9BQU8sR0FBbUM7WUFFNUMsZ0VBQWdFO1lBQ2hFLDJEQUEyRDtZQUMzRCxJQUFJLEVBQUUsQ0FBRSxRQUFRLENBQUU7U0FDckIsQ0FBQztRQUVGLElBQUssSUFBSSxFQUFHO1lBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBRSw4Q0FBK0MsSUFBSyxHQUFHLENBQUUsQ0FBQztZQUN6RSxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUN2QjtRQUVELElBQUssS0FBSyxFQUFHO1lBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBRSw4Q0FBK0MsS0FBTSxHQUFHLENBQUUsQ0FBQztZQUMxRSxPQUFPLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztTQUNsQztR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