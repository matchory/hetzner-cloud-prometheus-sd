import { microSecondsToMilliseconds } from '../utilities.mjs';
export class ClosedConnectionError extends Error {
    constructor(duration) {
        const durationMs = microSecondsToMilliseconds(duration);
        super(`Client closed the connection after ${durationMs}ms`);
        Object.setPrototypeOf(this, ClosedConnectionError.prototype);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvc2VkQ29ubmVjdGlvbkVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vycm9ycy9DbG9zZWRDb25uZWN0aW9uRXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFOUQsTUFBTSxPQUFPLHFCQUFzQixTQUFRLEtBQUs7SUFFNUMsWUFBYSxRQUFnQjtRQUN6QixNQUFNLFVBQVUsR0FBRywwQkFBMEIsQ0FBRSxRQUFRLENBQUUsQ0FBQztRQUUxRCxLQUFLLENBQUUsc0NBQXVDLFVBQVcsSUFBSSxDQUFFLENBQUM7UUFDaEUsTUFBTSxDQUFDLGNBQWMsQ0FBRSxJQUFJLEVBQUUscUJBQXFCLENBQUMsU0FBUyxDQUFFLENBQUM7SUFDbkUsQ0FBQztDQUNKIn0=