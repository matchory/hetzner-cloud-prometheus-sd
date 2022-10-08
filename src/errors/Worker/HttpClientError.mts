import { Request, Response } from 'node-fetch';

export class HttpClientError extends Error
{
    public request: Request;

    public response: Response | undefined;

    constructor( error: Error, request: Request, response?: Response ) {
        const message = response
                        ? `Request to ${ request.url } failed with status code ${ response.status }: ${ error.message }`
                        : `Request to ${ request.url } failed: ${ error.message }`;

        super( message );
        Object.setPrototypeOf( this, HttpClientError.prototype );

        this.request  = request;
        this.response = response;
    }

    get status(): number {
        return this.response?.status || 0;
    }
}
