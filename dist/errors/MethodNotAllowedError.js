import { HttpError } from './HttpError.js';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWV0aG9kTm90QWxsb3dlZEVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vycm9ycy9NZXRob2ROb3RBbGxvd2VkRXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxTQUFTO0lBRXhDLE9BQU8sQ0FBVztJQUUxQixZQUFvQixPQUFpQjtRQUNqQyxLQUFLLENBQ0QsOEJBQThCLEdBQUcsQ0FBRSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDbEIsQ0FBQyxDQUFDLFVBQVcsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUcsRUFBRTtZQUNwQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFFLENBQ3hELENBQUM7UUFDRixNQUFNLENBQUMsY0FBYyxDQUFFLElBQUksRUFBRSxxQkFBcUIsQ0FBQyxTQUFTLENBQUUsQ0FBQztRQUMvRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBVyxNQUFNO1FBQ2IsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBVyxNQUFNO1FBQ2IsT0FBTyx1Q0FBdUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2QsT0FBTztZQUNILE9BQU8sRUFBRSxDQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxDQUFFO1NBQ3pDLENBQUM7SUFDTixDQUFDO0NBQ0oifQ==