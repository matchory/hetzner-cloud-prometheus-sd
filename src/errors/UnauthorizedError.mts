import { HttpError } from './HttpError.mjs';

export class UnauthorizedError extends HttpError
{
    private challenges: string[];

    public constructor( challenges: string[] ) {
        super(
            `Unauthorized`,
        );
        Object.setPrototypeOf( this, UnauthorizedError.prototype );
        this.challenges = challenges;
    }

    public get status(): number {
        return 404;
    }

    public get headers(): Record<string, string[]> {
        return {
            ...super.headers,
            'WWW-Authenticate': [ this.challenges.join( ', ' ) ],
        };
    }
}
