export class AuthenticationError extends Error
{
    constructor() {
        super(
            'Failed to authenticate to the Hetzner API: ' +
            'The token is probably invalid. ' +
            'Refer to the documentation to learn about obtaining a valid ' +
            'access token for the Hetzner Cloud API',
        );
        Object.setPrototypeOf( this, AuthenticationError.prototype );
    }
}
