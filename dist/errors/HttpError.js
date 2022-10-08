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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHR0cEVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vycm9ycy9IdHRwRXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLFNBQVUsU0FBUSxLQUFLO0lBRXRCLE9BQU8sQ0FBcUI7SUFFdEMsWUFBb0IsT0FBZSxFQUFFLE1BQWU7UUFDaEQsS0FBSyxDQUFFLE9BQU8sQ0FBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxjQUFjLENBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUUsQ0FBQztJQUN2RCxDQUFDO0lBRUQsSUFBVyxNQUFNO1FBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFXLE1BQU07UUFDYixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFXLE9BQU87UUFDZCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7Q0FDSiJ9