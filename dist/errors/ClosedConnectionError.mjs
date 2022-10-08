import { microSecondsToMilliseconds } from '../utilities.mjs';
export class ClosedConnectionError extends Error {
    constructor(duration) {
        const durationMs = microSecondsToMilliseconds(duration);
        super(`Client closed the connection after ${durationMs}ms`);
        Object.setPrototypeOf(this, ClosedConnectionError.prototype);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvc2VkQ29ubmVjdGlvbkVycm9yLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lcnJvcnMvQ2xvc2VkQ29ubmVjdGlvbkVycm9yLm10cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU5RCxNQUFNLE9BQU8scUJBQXNCLFNBQVEsS0FBSztJQUU1QyxZQUFhLFFBQWdCO1FBQ3pCLE1BQU0sVUFBVSxHQUFHLDBCQUEwQixDQUFFLFFBQVEsQ0FBRSxDQUFDO1FBRTFELEtBQUssQ0FBRSxzQ0FBdUMsVUFBVyxJQUFJLENBQUUsQ0FBQztRQUNoRSxNQUFNLENBQUMsY0FBYyxDQUFFLElBQUksRUFBRSxxQkFBcUIsQ0FBQyxTQUFTLENBQUUsQ0FBQztJQUNuRSxDQUFDO0NBQ0oifQ==