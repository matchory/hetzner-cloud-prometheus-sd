import { HttpError } from './HttpError.mjs';

export class MethodNotAllowedError extends HttpError
{
    private allowed: string[];

    public constructor( allowed: string[] ) {
        super(
            'Method not allowed: Must be ' + ( allowed.length > 1
                                               ? `one of ${ allowed.join( ', ' ) }`
                                               : allowed.join() ),
        );
        Object.setPrototypeOf( this, MethodNotAllowedError.prototype );
        this.allowed = allowed;
    }

    public get status(): number {
        return 405;
    }

    public get detail(): string {
        return 'The server only accepts GET requests.';
    }

    public get headers(): Record<string, string[]> {
        return {
            'Allow': [ this.allowed.join( ', ' ) ],
        };
    }
}
