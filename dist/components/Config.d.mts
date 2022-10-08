import { Arguments, InferredOptionTypes } from 'yargs';
import { LogLevel } from '../logging.mjs';
import { CamelCaseKey } from '../utilities.mjs';
export declare class Config {
    static DEFAULT_HOSTNAME: string;
    static DEFAULT_PORT: number;
    static DEFAULT_REFRESH_INTERVAL: number;
    static DEFAULT_NODE_PORT: number;
    static DEFAULT_METRICS_ENDPOINT: string;
    static DEFAULT_NODE_LABEL_PREFIX: string;
    static DEFAULT_LOG_LEVEL: LogLevel;
    private readonly args;
    private readonly env;
    constructor(args: ProcessArgs, env?: NodeJS.ProcessEnv);
    get hostname(): string;
    get port(): number;
    get https(): boolean;
    get mTlsCa(): string | null;
    get hetznerApiToken(): string;
    get refreshInterval(): number;
    get metricsEndpoint(): string;
    get nodePort(): number;
    get nodeNetwork(): string | null;
    get nodeLabelPrefix(): string;
    get logLevel(): LogLevel;
    get debug(): boolean;
    validate(): void;
}
export declare const options: {
    'config-file': {
        string: boolean;
        alias: string;
        default: string;
        description: string;
        config: boolean;
        configParser: typeof parseConfigFile;
    };
    'hetzner-api-token': {
        string: boolean;
        demandOption: boolean;
        alias: string;
        requiresArg: boolean;
        description: string;
    };
    hostname: {
        string: boolean;
        alias: string;
        requiresArg: boolean;
        default: string;
        description: string;
    };
    port: {
        alias: string;
        number: boolean;
        requiresArg: boolean;
        default: number;
        description: string;
    };
    https: {
        alias: string;
        boolean: boolean;
        default: boolean;
        description: string;
    };
    'm-tls-ca': {
        string: boolean;
        default: string;
        requiresArg: boolean;
        description: string;
    };
    'refresh-interval': {
        alias: string;
        number: boolean;
        requiresArg: boolean;
        default: number;
        description: string;
    };
    'metrics-endpoint': {
        string: boolean;
        requiresArg: boolean;
        default: string;
        description: string;
    };
    'node-port': {
        string: boolean;
        requiresArg: boolean;
        default: number;
        description: string;
    };
    'node-network': {
        string: boolean;
        default: string;
        requiresArg: boolean;
        description: string;
    };
    'node-label-prefix': {
        string: boolean;
        requiresArg: boolean;
        default: string;
        description: string;
    };
    'log-level': {
        string: boolean;
        choices: LogLevel[];
        requiresArg: boolean;
        default: LogLevel;
        description: string;
    };
    debug: {
        alias: string;
        boolean: boolean;
        default: boolean;
        description: string;
    };
};
declare function parseConfigFile(path: string): ConfigFileContent;
declare type ConfigFileContent = Omit<{
    [key in keyof ProcessArgTypes as CamelCaseKey<key>]: ProcessArgTypes[key];
}, '$0' | '_' | 'configFile'>;
export declare type ProcessArgs = {
    [key in keyof ProcessArgTypes as key | CamelCaseKey<key>]: ProcessArgTypes[key];
};
declare type ProcessArgTypes = Arguments<InferredOptionTypes<typeof options>>;
export {};
