import { Config } from './Config.mjs';
import { DataStore } from './DataStore.js';
import { Server } from './HetznerApiClient.mjs';

declare global
{
    namespace NodeJS
    {
        interface ProcessEnv
        {
            HETZNER_SD_CONFIG_FILE: string | undefined;
            HETZNER_SD_API_TOKEN: string | undefined;
            HETZNER_SD_API_TOKEN_FILE: string | undefined;
            HETZNER_SD_AUTH_BEARER: string | undefined;
            HETZNER_SD_AUTH_BEARER_FILE: string | undefined;
            HETZNER_SD_AUTH_BASIC: string | undefined;
            HETZNER_SD_AUTH_BASIC_FILE: string | undefined;
            HETZNER_SD_DEBUG: string | undefined;
            HETZNER_SD_HOSTNAME: string | undefined;
            HETZNER_SD_HTTPS: string | undefined;
            HETZNER_SD_LOG_LEVEL: string | undefined;
            HETZNER_SD_METRICS_ENDPOINT: string | undefined;
            HETZNER_SD_M_TLS_CA: string | undefined;
            HETZNER_SD_NODE_LABEL_PREFIX: string | undefined;
            HETZNER_SD_NODE_PORT: string | undefined;
            HETZNER_SD_NODE_NETWORK: string | undefined;
            HETZNER_SD_PORT: string | undefined;
            HETZNER_SD_REFRESH_INTERVAL: string | undefined;
        }
    }

    namespace http
    {
        interface IncomingMessage
        {
            config: Config;
            dataStore: DataStore<Server[]>;
            attributes: Record<string, any>;
        }
    }
}

export {};
