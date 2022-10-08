import { HttpError } from './HttpError.mjs';

export class NotFoundError extends HttpError
{
    public constructor( path: string ) {
        super(
            `Resource not found`,
            `The server does not provide an endpoint at '${ path }'`,
        );
        Object.setPrototypeOf( this, NotFoundError.prototype );
    }

    public get status(): number {
        return 404;
    }
}
