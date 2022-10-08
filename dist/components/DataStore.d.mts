/// <reference types="node" resolution-mode="require"/>
import { EventEmitter } from 'events';
import { Config } from './Config.mjs';
export declare class DataStore<T = unknown> extends EventEmitter {
    config: Config;
    data: T | null;
    constructor(config: Config);
    getServers(): T | null;
    updateServers(data: T): Promise<void>;
    protected persist(data: T): Promise<void>;
    restore(): Promise<void>;
}
