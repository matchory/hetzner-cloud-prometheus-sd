import { HttpError } from './HttpError.js';
export declare class NotFoundError extends HttpError {
    constructor(path: string);
    get status(): number;
}
