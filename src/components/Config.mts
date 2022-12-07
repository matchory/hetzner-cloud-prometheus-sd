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
        return this.args.hostname;
    }

    get port(): number {
        return Number( this.args.port );
    }

    get https(): boolean {
        return this.args.https
               || isFlagEnabled( this.env.HETZNER_SD_HTTPS )
               || false;
    }

    get mTlsCa(): string | null {
        return this.args[ 'm-tls-ca' ] || null;
    }

    get apiToken(): string {
        return this.args[ 'api-token' ]
               || this.args[ 'api-token-file' ]
               || '';
    }

    get authBearer(): string | undefined {
        return this.args[ 'auth-bearer' ] || this.args[ 'auth-bearer-file' ];
    }

    get authBasic(): string | undefined {
        return this.args[ 'auth-basic' ] || this.args[ 'auth-basic-file' ];
    }

    get authEnabled(): boolean {
        return !!( this.authBearer || this.authBasic );
    }

    get refreshInterval(): number {
        return Number( this.args[ 'refresh-interval' ] );
    }

    get metricsEndpoint(): string {
        return this.args[ 'metrics-endpoint' ];
    }

    get nodePort(): number {
        return Number( this.args[ 'node-port' ] );
    }

    get nodeNetwork(): string | null {
        return this.args[ 'node-network' ];
    }

    get nodeLabelPrefix(): string {
        return this.args[ 'node-label-prefix' ];
    }

    get logLevel(): LogLevel {
        return this.args[ 'log-level' ];
    }

    get debug(): boolean {
        return this.args.debug
               || isFlagEnabled( this.env.HETZNER_SD_DEBUG )
               || false;
    }

    public validate(): void {
        if ( !this.apiToken ) {
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
    'api-token': {
        string: true,
        alias: 't',
        conflicts: 'api-token-file',
        default: undefined,
        requiresArg: true,
        description: 'API token obtained from Hetzner Cloud',
    },
    'api-token-file': {
        string: true,
        conflicts: 'api-token',
        coerce: ( path: string ) => loadSecret( path ),
        default: undefined,
        requiresArg: true,
        description: 'File containing the API token obtained from Hetzner Cloud',
    },
    'auth-bearer': {
        string: true,
        alias: 'a',
        requiresArg: true,
        default: undefined,
        conflicts: [ 'auth-bearer-file', 'auth-basic', 'auth-basic-file' ],
        description: 'Enables bearer token authentication by checking the ' +
                     'Authorization header on incoming requests against the ' +
                     'given value. Incompatible with --auth-basic',
    },
    'auth-bearer-file': {
        string: true,
        conflicts: [ 'auth-bearer', 'auth-basic', 'auth-basic-file' ],
        coerce: ( path: string ) => loadSecret( path ),
        default: undefined,
        requiresArg: true,
        description: 'File containing the bearer token',
    },
    'auth-basic': {
        string: true,
        alias: 'A',
        default: undefined,
        conflicts: [ 'auth-basic-file', 'auth-bearer', 'auth-bearer-file' ],
        requiresArg: true,
        description: 'Enables basic authentication by checking the ' +
                     'Authorization header on incoming requests against the ' +
                     'given credentials. Provide username and password ' +
                     'separated by a colon, e.g. "user:pass". Incompatible ' +
                     'with --auth-bearer',
    },
    'auth-basic-file': {
        string: true,
        conflicts: [ 'auth-basic', 'auth-bearer', 'auth-bearer-file' ],
        coerce: ( path: string ) => loadSecret( path ),
        default: undefined,
        requiresArg: true,
        description: 'File containing the basic auth credentials',
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
        description: 'Whether to start an HTTPS server. Requires additional ' +
                     'configuration.',
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
        default: Config.DEFAULT_LOG_LEVEL,
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

const pathCache = new Map<string, string>();

function loadSecret( path: string | undefined ): string | undefined {
    if ( !path ) {
        return undefined;
    }

    if ( !pathCache.has( path ) ) {
        const value = readFileSync( path, 'utf-8' );

        pathCache.set( path, value.trimEnd() );
    }

    return pathCache.get( path );
}

type ConfigFileContent = Omit<{
    [key in keyof ProcessArgTypes as CamelCaseKey<key>]: ProcessArgTypes[key]
}, '$0' | '_' | 'configFile'>

export type ProcessArgs = {
    [key in keyof ProcessArgTypes as key | CamelCaseKey<key>]: ProcessArgTypes[key]
};

type ProcessArgTypes = Arguments<InferredOptionTypes<typeof options>>;
