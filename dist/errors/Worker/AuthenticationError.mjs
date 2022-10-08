export class AuthenticationError extends Error {
    constructor() {
        super('Failed to authenticate to the Hetzner API: ' +
            'The token is probably invalid. ' +
            'Refer to the documentation to learn about obtaining a valid ' +
            'access token for the Hetzner Cloud API');
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aGVudGljYXRpb25FcnJvci5tanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXJyb3JzL1dvcmtlci9BdXRoZW50aWNhdGlvbkVycm9yLm10cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsS0FBSztJQUUxQztRQUNJLEtBQUssQ0FDRCw2Q0FBNkM7WUFDN0MsaUNBQWlDO1lBQ2pDLDhEQUE4RDtZQUM5RCx3Q0FBd0MsQ0FDM0MsQ0FBQztRQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUUsSUFBSSxFQUFFLG1CQUFtQixDQUFDLFNBQVMsQ0FBRSxDQUFDO0lBQ2pFLENBQUM7Q0FDSiJ9