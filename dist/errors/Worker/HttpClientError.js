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
    get url() {
        return this.request.url;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHR0cENsaWVudEVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Vycm9ycy9Xb3JrZXIvSHR0cENsaWVudEVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sT0FBTyxlQUFnQixTQUFRLEtBQUs7SUFFL0IsT0FBTyxDQUFVO0lBRWpCLFFBQVEsQ0FBdUI7SUFFdEMsWUFBYSxLQUFZLEVBQUUsT0FBZ0IsRUFBRSxRQUFtQjtRQUM1RCxNQUFNLE9BQU8sR0FBRyxRQUFRO1lBQ1IsQ0FBQyxDQUFDLGNBQWUsT0FBTyxDQUFDLEdBQUksNEJBQTZCLFFBQVEsQ0FBQyxNQUFPLEtBQU0sS0FBSyxDQUFDLE9BQVEsRUFBRTtZQUNoRyxDQUFDLENBQUMsY0FBZSxPQUFPLENBQUMsR0FBSSxZQUFhLEtBQUssQ0FBQyxPQUFRLEVBQUUsQ0FBQztRQUUzRSxLQUFLLENBQUUsT0FBTyxDQUFFLENBQUM7UUFDakIsTUFBTSxDQUFDLGNBQWMsQ0FBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLFNBQVMsQ0FBRSxDQUFDO1FBRXpELElBQUksQ0FBQyxPQUFPLEdBQUksT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBSSxHQUFHO1FBQ0gsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUM1QixDQUFDO0NBQ0oifQ==