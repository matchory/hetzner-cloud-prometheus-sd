export class HttpError extends Error
{
    protected _detail: string | undefined;

    public constructor( message: string, detail?: string ) {
        super( message );
        this._detail = detail;
        Object.setPrototypeOf( this, HttpError.prototype );
    }

    public get detail(): string | undefined {
        return this._detail;
    }

    public get status(): number {
        return 500;
    }

    public get headers(): Record<string, string[]> {
        return {};
    }
}
