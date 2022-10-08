import { HttpError } from './HttpError.mjs';
export class MethodNotAllowedError extends HttpError {
    allowed;
    constructor(allowed) {
        super('Method not allowed: Must be ' + (allowed.length > 1
            ? `one of ${allowed.join(', ')}`
            : allowed.join()));
        Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
        this.allowed = allowed;
    }
    get status() {
        return 405;
    }
    get detail() {
        return 'The server only accepts GET requests.';
    }
    get headers() {
        return {
            'Allow': [this.allowed.join(', ')],
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWV0aG9kTm90QWxsb3dlZEVycm9yLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lcnJvcnMvTWV0aG9kTm90QWxsb3dlZEVycm9yLm10cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFNUMsTUFBTSxPQUFPLHFCQUFzQixTQUFRLFNBQVM7SUFFeEMsT0FBTyxDQUFXO0lBRTFCLFlBQW9CLE9BQWlCO1FBQ2pDLEtBQUssQ0FDRCw4QkFBOEIsR0FBRyxDQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNsQixDQUFDLENBQUMsVUFBVyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRyxFQUFFO1lBQ3BDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUUsQ0FDeEQsQ0FBQztRQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUUsSUFBSSxFQUFFLHFCQUFxQixDQUFDLFNBQVMsQ0FBRSxDQUFDO1FBQy9ELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFXLE1BQU07UUFDYixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFXLE1BQU07UUFDYixPQUFPLHVDQUF1QyxDQUFDO0lBQ25ELENBQUM7SUFFRCxJQUFXLE9BQU87UUFDZCxPQUFPO1lBQ0gsT0FBTyxFQUFFLENBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFFLENBQUU7U0FDekMsQ0FBQztJQUNOLENBQUM7Q0FDSiJ9