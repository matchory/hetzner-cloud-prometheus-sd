export class AuthenticationError extends Error {
    constructor() {
        super('Failed to authenticate to the Hetzner API: ' +
            'The token is probably invalid. ' +
            'Refer to the documentation to learn about obtaining a valid ' +
            'access token for the Hetzner Cloud API');
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aGVudGljYXRpb25FcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lcnJvcnMvV29ya2VyL0F1dGhlbnRpY2F0aW9uRXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLG1CQUFvQixTQUFRLEtBQUs7SUFFMUM7UUFDSSxLQUFLLENBQ0QsNkNBQTZDO1lBQzdDLGlDQUFpQztZQUNqQyw4REFBOEQ7WUFDOUQsd0NBQXdDLENBQzNDLENBQUM7UUFDRixNQUFNLENBQUMsY0FBYyxDQUFFLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLENBQUUsQ0FBQztJQUNqRSxDQUFDO0NBQ0oifQ==