/// <reference types="node" resolution-mode="require"/>
import { IncomingMessage, ServerResponse } from 'http';
import { Config } from '../components/Config.mjs';
import { DataStore } from '../components/DataStore.mjs';
import { Server } from '../components/HetznerApiClient.mjs';
export declare type ErrorRequestListener = (request: IncomingMessage, response: ServerResponse, error?: Error) => void | Promise<void>;
export declare const error: (config: Config, dataStore: DataStore<Server[]>) => ErrorRequestListener;
export interface ErrorPayload {
    errors: ErrorRepresentation[];
}
interface ErrorRepresentation {
    code?: string;
    title: string;
    detail?: string;
    source?: {
        pointer: string;
    };
    meta?: {
        stack?: string[];
    };
}
export {};
