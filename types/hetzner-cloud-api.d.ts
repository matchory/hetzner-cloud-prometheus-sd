declare module 'hetzner-cloud-api'
{
    class Cloud
    {
        constructor( token: string );

        getServers(): Promise<unknown>;

        createServer( options: CreateServerOptions ): Promise<unknown>;

        getServer( id: string ): Promise<unknown>;

        deleteServer( id: string ): Promise<unknown>;

        updateServer( id: string, options ): Promise<unknown>;

        getServerMetrics( id: string, query ): Promise<unknown>;

        powerOffServer( id: string ): Promise<unknown>;

        powerOnServer( id: string ): Promise<unknown>;

        rebootServer( id: string ): Promise<unknown>;

        shutdownServer( id: string ): Promise<unknown>;

        images(): Promise<unknown>;

        image( id: string ): Promise<unknown>;

        deleteImage( id: string ): Promise<unknown>;

        updateImage( id: string, options ): Promise<unknown>;
    }

    interface CreateServerOptions
    {
    }

    export default Cloud;
}
