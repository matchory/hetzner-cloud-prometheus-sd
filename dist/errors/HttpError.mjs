export class HttpError extends Error {
    _detail;
    constructor(message, detail) {
        super(message);
        this._detail = detail;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
    get detail() {
        return this._detail;
    }
    get status() {
        return 500;
    }
    get headers() {
        return {};
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHR0cEVycm9yLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lcnJvcnMvSHR0cEVycm9yLm10cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8sU0FBVSxTQUFRLEtBQUs7SUFFdEIsT0FBTyxDQUFxQjtJQUV0QyxZQUFvQixPQUFlLEVBQUUsTUFBZTtRQUNoRCxLQUFLLENBQUUsT0FBTyxDQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsTUFBTSxDQUFDLGNBQWMsQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRCxJQUFXLE1BQU07UUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQVcsTUFBTTtRQUNiLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVELElBQVcsT0FBTztRQUNkLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUNKIn0=