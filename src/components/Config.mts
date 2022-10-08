import { readFileSync } from 'fs';
import { env as environment } from 'node:process';
import { parse } from 'yaml';
import { Arguments, InferredOptionTypes } from 'yargs';
import { LogLevel, logLevels } from '../logging.mjs';
import { CamelCaseKey } from '../utilities.mjs';

export class Config
{
    public static DEFAULT_HOSTNAME: string = 'localhost';

    public static DEFAULT_PORT: number = 7764;

    public static DEFAULT_REFRESH_INTERVAL: number = 30_000;

    public static DEFAULT_NODE_PORT: number = 9090;

    public static DEFAULT_METRICS_ENDPOINT: string = '/metrics';

    public static DEFAULT_NODE_LABEL_PREFIX: string = 'hetzner';

    public static DEFAULT_LOG_LEVEL: LogLevel = 'debug';

    private readonly args: ProcessArgs;

    private readonly env: NodeJS.ProcessEnv;

    constructor( args: ProcessArgs, env: NodeJS.ProcessEnv = environment ) {
        this.args = args;
        this.env  = env;
    }

    get hostname(): string {
        return this.args.hostname
               || this.env.HETZNER_SD_HOSTNAME
               || Config.DEFAULT_HOSTNAME;
    }

    get port(): number {
        return Number(
            this.args.port
            || this.env.HETZNER_SD_PORT
            || Config.DEFAULT_PORT,
        );
    }

    get https(): boolean {
        return this.args.https
               || isFlagEnabled( this.env.HETZNER_SD_HTTPS )
               || false;
    }

    get mTlsCa(): string | null {
        return this.args[ 'm-tls-ca' ]
               || this.env.HETZNER_SD_MTLS_CA
               || null;
    }

    get hetznerApiToken(): string {
        return (
            this.args[ 'hetzner-api-token' ]
            || this.env.HETZNER_SD_API_TOKEN
        ) as string;
    }

    get refreshInterval(): number {
        return Number(
            this.args[ 'refresh-interval' ]
            || this.env.HETZNER_SD_REFRESH_INTERVAL
            || Config.DEFAULT_REFRESH_INTERVAL,
        );
    }

    get metricsEndpoint(): string {
        return this.args[ 'metrics-endpoint' ]
               || this.env.HETZNER_SD_METRICS_ENDPOINT
               || Config.DEFAULT_METRICS_ENDPOINT;
    }

    get nodePort(): number {
        return Number(
            this.args[ 'node-port' ]
            || this.env.HETZNER_SD_NODE_PORT
            || Config.DEFAULT_NODE_PORT,
        );
    }

    get nodeNetwork(): string | null {
        return this.args[ 'node-network' ]
               || this.env.HETZNER_SD_NODE_NETWORK
               || null;
    }

    get nodeLabelPrefix(): string {
        return this.args[ 'node-label-prefix' ]
               || this.env.HETZNER_SD_NODE_LABEL_PREFIX
               || Config.DEFAULT_NODE_LABEL_PREFIX;
    }

    get logLevel(): LogLevel {
        return this.args[ 'log-level' ]
               || this.env.HETZNER_SD_LOG_LEVEL
               || Config.DEFAULT_LOG_LEVEL;
    }

    get debug(): boolean {
        return this.args.debug
               || isFlagEnabled( this.env.HETZNER_SD_DEBUG )
               || false;
    }

    public validate(): void {
        if ( !this.hetznerApiToken ) {
            throw new Error( 'Bad configuration: Missing Hetzner API token' );
        }

        if ( this.port < 1 || this.port > 65_535 ) {
            throw new Error( 'Bad configuration: Port out of range' );
        }

        if ( this.hostname.length < 1 || this.hostname.length > 4096 ) {
            throw new Error( 'Bad configuration: Invalid hostname' );
        }

        if ( this.mTlsCa && !this.https ) {
            throw new Error(
                'Bad configuration: mTLS cannot be used without an HTTPS server',
            );
        }

        if ( this.nodePort < 1 || this.nodePort > 65_535 ) {
            throw new Error( 'Bad configuration: Node port out of range' );
        }

        if ( this.refreshInterval < 1_000 ) {
            throw new Error(
                'Bad configuration: Refresh interval must be greater than ' +
                'one second to prevent triggering Hetzner\'s rate limits',
            );
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
        default: 'debug' as LogLevel,
        description: 'Controls the amount of log messages printed.',
    },
    debug: {
        alias: 'D',
        boolean: true,
        default: false,
        description: 'Enable debugging mode',
    },
};

function isFlagEnabled( value: string | undefined ): boolean {
    return (
        typeof value === 'string' &&
        [ 'true', '1', 'on', 'yes' ].includes( value.toLowerCase().trim() )
    );
}

function parseConfigFile( path: string ): ConfigFileContent {
    let content;

    try {
        content = readFileSync( path, 'utf-8' );
    } catch ( error ) {
        if ( !( error instanceof Error ) ) {
            throw error;
        }

        console.error( `Invalid configuration file "${ path }":\n${ error.message }` );
        process.exit( 2 );
    }

    const parsed: ConfigFileContent | string | null = parse( content );

    if ( typeof parsed !== 'object' || parsed === null ) {
        console.error( `Invalid configuration file "${ path }":\nFailed to parse file` );
        process.exit( 2 );
    }

    return parsed;
}

type ConfigFileContent = Omit<{
    [key in keyof ProcessArgTypes as CamelCaseKey<key>]: ProcessArgTypes[key]
}, '$0' | '_' | 'configFile'>

export type ProcessArgs = {
    [key in keyof ProcessArgTypes as key | CamelCaseKey<key>]: ProcessArgTypes[key]
};

type ProcessArgTypes = Arguments<InferredOptionTypes<typeof options>>;
