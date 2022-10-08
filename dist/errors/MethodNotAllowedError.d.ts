import { HttpError } from './HttpError.js';
export declare class MethodNotAllowedError extends HttpError {
    private allowed;
    constructor(allowed: string[]);
    get status(): number;
    get detail(): string;
    get headers(): Record<string, string[]>;
}
