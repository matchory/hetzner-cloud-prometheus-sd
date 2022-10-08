import { HttpError } from './HttpError.mjs';
export class NotFoundError extends HttpError {
    constructor(path) {
        super(`Resource not found`, `The server does not provide an endpoint at '${path}'`);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    get status() {
        return 404;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90Rm91bmRFcnJvci5tanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3JzL05vdEZvdW5kRXJyb3IubXRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUU1QyxNQUFNLE9BQU8sYUFBYyxTQUFRLFNBQVM7SUFFeEMsWUFBb0IsSUFBWTtRQUM1QixLQUFLLENBQ0Qsb0JBQW9CLEVBQ3BCLCtDQUFnRCxJQUFLLEdBQUcsQ0FDM0QsQ0FBQztRQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUUsQ0FBQztJQUMzRCxDQUFDO0lBRUQsSUFBVyxNQUFNO1FBQ2IsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0NBQ0oifQ==