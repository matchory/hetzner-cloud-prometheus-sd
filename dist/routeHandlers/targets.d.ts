import { RequestListener } from 'http';
import { Config } from '../components/Config.mjs';
import { DataStore } from '../components/DataStore.mjs';
import { Server } from '../components/HetznerApiClient.mjs';
export declare const targets: (config: Config, dataStore: DataStore<Server[]>) => RequestListener;
