import { microSecondsToMilliseconds } from '../utilities.mjs';

export class ClosedConnectionError extends Error
{
    constructor( duration: bigint ) {
        const durationMs = microSecondsToMilliseconds( duration );

        super( `Client closed the connection after ${ durationMs }ms` );
        Object.setPrototypeOf( this, ClosedConnectionError.prototype );
    }
}
