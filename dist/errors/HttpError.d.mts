export declare class HttpError extends Error {
    protected _detail: string | undefined;
    constructor(message: string, detail?: string);
    get detail(): string | undefined;
    get status(): number;
    get headers(): Record<string, string[]>;
}
