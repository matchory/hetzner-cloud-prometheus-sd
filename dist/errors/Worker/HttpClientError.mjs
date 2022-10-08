export class HttpClientError extends Error {
    request;
    response;
    constructor(error, request, response) {
        const message = response
            ? `Request to ${request.url} failed with status code ${response.status}: ${error.message}`
            : `Request to ${request.url} failed: ${error.message}`;
        super(message);
        Object.setPrototypeOf(this, HttpClientError.prototype);
        this.request = request;
        this.response = response;
    }
    get status() {
        return this.response?.status || 0;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHR0cENsaWVudEVycm9yLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lcnJvcnMvV29ya2VyL0h0dHBDbGllbnRFcnJvci5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxPQUFPLGVBQWdCLFNBQVEsS0FBSztJQUUvQixPQUFPLENBQVU7SUFFakIsUUFBUSxDQUF1QjtJQUV0QyxZQUFhLEtBQVksRUFBRSxPQUFnQixFQUFFLFFBQW1CO1FBQzVELE1BQU0sT0FBTyxHQUFHLFFBQVE7WUFDUixDQUFDLENBQUMsY0FBZSxPQUFPLENBQUMsR0FBSSw0QkFBNkIsUUFBUSxDQUFDLE1BQU8sS0FBTSxLQUFLLENBQUMsT0FBUSxFQUFFO1lBQ2hHLENBQUMsQ0FBQyxjQUFlLE9BQU8sQ0FBQyxHQUFJLFlBQWEsS0FBSyxDQUFDLE9BQVEsRUFBRSxDQUFDO1FBRTNFLEtBQUssQ0FBRSxPQUFPLENBQUUsQ0FBQztRQUNqQixNQUFNLENBQUMsY0FBYyxDQUFFLElBQUksRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFFLENBQUM7UUFFekQsSUFBSSxDQUFDLE9BQU8sR0FBSSxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDSiJ9