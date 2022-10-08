import { Request, Response } from 'node-fetch';
export declare class HttpClientError extends Error {
    request: Request;
    response: Response | undefined;
    constructor(error: Error, request: Request, response?: Response);
    get status(): number;
}
