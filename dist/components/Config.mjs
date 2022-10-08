import { readFileSync } from 'fs';
import { env as environment } from 'node:process';
import { parse } from 'yaml';
import { logLevels } from '../logging.mjs';
export class Config {
    static DEFAULT_HOSTNAME = 'localhost';
    static DEFAULT_PORT = 7764;
    static DEFAULT_REFRESH_INTERVAL = 30_000;
    static DEFAULT_NODE_PORT = 9090;
    static DEFAULT_METRICS_ENDPOINT = '/metrics';
    static DEFAULT_NODE_LABEL_PREFIX = 'hetzner';
    static DEFAULT_LOG_LEVEL = 'debug';
    args;
    env;
    constructor(args, env = environment) {
        this.args = args;
        this.env = env;
    }
    get hostname() {
        return this.args.hostname
            || this.env.HETZNER_SD_HOSTNAME
            || Config.DEFAULT_HOSTNAME;
    }
    get port() {
        return Number(this.args.port
            || this.env.HETZNER_SD_PORT
            || Config.DEFAULT_PORT);
    }
    get https() {
        return this.args.https
            || isFlagEnabled(this.env.HETZNER_SD_HTTPS)
            || false;
    }
    get mTlsCa() {
        return this.args['m-tls-ca']
            || this.env.HETZNER_SD_MTLS_CA
            || null;
    }
    get hetznerApiToken() {
        return (this.args['hetzner-api-token']
            || this.env.HETZNER_SD_API_TOKEN);
    }
    get refreshInterval() {
        return Number(this.args['refresh-interval']
            || this.env.HETZNER_SD_REFRESH_INTERVAL
            || Config.DEFAULT_REFRESH_INTERVAL);
    }
    get metricsEndpoint() {
        return this.args['metrics-endpoint']
            || this.env.HETZNER_SD_METRICS_ENDPOINT
            || Config.DEFAULT_METRICS_ENDPOINT;
    }
    get nodePort() {
        return Number(this.args['node-port']
            || this.env.HETZNER_SD_NODE_PORT
            || Config.DEFAULT_NODE_PORT);
    }
    get nodeNetwork() {
        return this.args['node-network']
            || this.env.HETZNER_SD_NODE_NETWORK
            || null;
    }
    get nodeLabelPrefix() {
        return this.args['node-label-prefix']
            || this.env.HETZNER_SD_NODE_LABEL_PREFIX
            || Config.DEFAULT_NODE_LABEL_PREFIX;
    }
    get logLevel() {
        return this.args['log-level']
            || this.env.HETZNER_SD_LOG_LEVEL
            || Config.DEFAULT_LOG_LEVEL;
    }
    get debug() {
        return this.args.debug
            || isFlagEnabled(this.env.HETZNER_SD_DEBUG)
            || false;
    }
    validate() {
        if (!this.hetznerApiToken) {
            throw new Error('Bad configuration: Missing Hetzner API token');
        }
        if (this.port < 1 || this.port > 65_535) {
            throw new Error('Bad configuration: Port out of range');
        }
        if (this.hostname.length < 1 || this.hostname.length > 4096) {
            throw new Error('Bad configuration: Invalid hostname');
        }
        if (this.mTlsCa && !this.https) {
            throw new Error('Bad configuration: mTLS cannot be used without an HTTPS server');
        }
        if (this.nodePort < 1 || this.nodePort > 65_535) {
            throw new Error('Bad configuration: Node port out of range');
        }
        if (this.refreshInterval < 1_000) {
            throw new Error('Bad configuration: Refresh interval must be greater than ' +
                'one second to prevent triggering Hetzner\'s rate limits');
        }
    }
}
export const options = {
    'config-file': {
        string: true,
        alias: 'c',
        default: '',
        description: 'Path to the configuration file',
        config: true,
        configParser: parseConfigFile,
    },
    'hetzner-api-token': {
        string: true,
        demandOption: true,
        alias: 't',
        requiresArg: true,
        description: 'API token obtained from Hetzner Cloud',
    },
    hostname: {
        string: true,
        alias: 'h',
        requiresArg: true,
        default: Config.DEFAULT_HOSTNAME,
        description: 'Hostname to listen on',
    },
    port: {
        alias: 'p',
        number: true,
        requiresArg: true,
        default: Config.DEFAULT_PORT,
        description: 'Port to listen on',
    },
    https: {
        alias: 'H',
        boolean: true,
        default: false,
        description: 'Whether to start an HTTPS server. Requires additional configuration.',
    },
    'm-tls-ca': {
        string: true,
        default: '',
        requiresArg: true,
        description: 'Path to the mTLS certificate authority file.',
    },
    'refresh-interval': {
        alias: 's',
        number: true,
        requiresArg: true,
        default: Config.DEFAULT_REFRESH_INTERVAL,
        description: 'How often to synchronize with the Hetzner API',
    },
    'metrics-endpoint': {
        string: true,
        requiresArg: true,
        default: Config.DEFAULT_METRICS_ENDPOINT,
        description: 'Endpoint provided by nodes to fetch metrics from',
    },
    'node-port': {
        string: true,
        requiresArg: true,
        default: Config.DEFAULT_NODE_PORT,
        description: 'Port the metrics server is listening on the nodes',
    },
    'node-network': {
        string: true,
        default: '',
        requiresArg: true,
        description: 'Name, ID, or CIDR range of the network to prefer when ' +
            'resolving nodes. If omitted, the public IP will ' +
            'be preferred.',
    },
    'node-label-prefix': {
        string: true,
        requiresArg: true,
        default: Config.DEFAULT_NODE_LABEL_PREFIX,
        'description': 'Prefix for labels attached to discovered nodes.',
    },
    'log-level': {
        string: true,
        choices: logLevels,
        requiresArg: true,
        default: 'debug',
        description: 'Controls the amount of log messages printed.',
    },
    debug: {
        alias: 'D',
        boolean: true,
        default: false,
        description: 'Enable debugging mode',
    },
};
function isFlagEnabled(value) {
    return (typeof value === 'string' &&
        ['true', '1', 'on', 'yes'].includes(value.toLowerCase().trim()));
}
function parseConfigFile(path) {
    let content;
    try {
        content = readFileSync(path, 'utf-8');
    }
    catch (error) {
        if (!(error instanceof Error)) {
            throw error;
        }
        console.error(`Invalid configuration file "${path}":\n${error.message}`);
        process.exit(2);
    }
    const parsed = parse(content);
    if (typeof parsed !== 'object' || parsed === null) {
        console.error(`Invalid configuration file "${path}":\nFailed to parse file`);
        process.exit(2);
    }
    return parsed;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlnLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0NvbmZpZy5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLElBQUksQ0FBQztBQUNsQyxPQUFPLEVBQUUsR0FBRyxJQUFJLFdBQVcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNsRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTdCLE9BQU8sRUFBWSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUdyRCxNQUFNLE9BQU8sTUFBTTtJQUVSLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBVyxXQUFXLENBQUM7SUFFOUMsTUFBTSxDQUFDLFlBQVksR0FBVyxJQUFJLENBQUM7SUFFbkMsTUFBTSxDQUFDLHdCQUF3QixHQUFXLE1BQU0sQ0FBQztJQUVqRCxNQUFNLENBQUMsaUJBQWlCLEdBQVcsSUFBSSxDQUFDO0lBRXhDLE1BQU0sQ0FBQyx3QkFBd0IsR0FBVyxVQUFVLENBQUM7SUFFckQsTUFBTSxDQUFDLHlCQUF5QixHQUFXLFNBQVMsQ0FBQztJQUVyRCxNQUFNLENBQUMsaUJBQWlCLEdBQWEsT0FBTyxDQUFDO0lBRW5DLElBQUksQ0FBYztJQUVsQixHQUFHLENBQW9CO0lBRXhDLFlBQWEsSUFBaUIsRUFBRSxNQUF5QixXQUFXO1FBQ2hFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUksR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtlQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CO2VBQzVCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ0osT0FBTyxNQUFNLENBQ1QsSUFBSSxDQUFDLElBQUksQ0FB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