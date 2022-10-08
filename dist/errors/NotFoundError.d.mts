import { HttpError } from './HttpError.mjs';
export declare class NotFoundError extends HttpError {
    constructor(path: string);
    get status(): number;
}
