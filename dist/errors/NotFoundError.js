import { HttpError } from './HttpError.js';
export class NotFoundError extends HttpError {
    constructor(path) {
        super(`Resource not found`, `The server does not provide an endpoint at '${path}'`);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    get status() {
        return 404;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90Rm91bmRFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lcnJvcnMvTm90Rm91bmRFcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsTUFBTSxPQUFPLGFBQWMsU0FBUSxTQUFTO0lBRXhDLFlBQW9CLElBQVk7UUFDNUIsS0FBSyxDQUNELG9CQUFvQixFQUNwQiwrQ0FBZ0QsSUFBSyxHQUFHLENBQzNELENBQUM7UUFDRixNQUFNLENBQUMsY0FBYyxDQUFFLElBQUksRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFFLENBQUM7SUFDM0QsQ0FBQztJQUVELElBQVcsTUFBTTtRQUNiLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztDQUNKIn0=