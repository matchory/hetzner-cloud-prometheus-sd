import { HttpError } from '../errors/HttpError.mjs';
export const error = (config, dataStore) => {
    return function errorRouteHandler(request, response, error) {
        const payload = {
            errors: [
                {
                    title: error?.message || 'Unknown error',
                },
            ],
        };
        if (config.debug) {
            payload.errors[0].meta = {
                stack: error?.stack
                    ?.split('\n')
                    ?.map(line => line.trim()),
            };
        }
        response.statusCode = error && error instanceof HttpError && error.status || 500;
        if (error && error instanceof HttpError) {
            if (error.detail) {
                payload.errors[0].detail = error.detail;
            }
            for (const [key, values] of Object.entries(error.headers)) {
                for (let value of values) {
                    response.setHeader(key, value);
                }
            }
        }
        response.end(config.debug
            ? JSON.stringify(payload, null, 4)
            : JSON.stringify(payload));
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVIYW5kbGVycy9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFJcEQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUUsTUFBYyxFQUFFLFNBQThCLEVBQXlCLEVBQUU7SUFDNUYsT0FBTyxTQUFTLGlCQUFpQixDQUM3QixPQUFPLEVBQ1AsUUFBUSxFQUNSLEtBQUs7UUFFTCxNQUFNLE9BQU8sR0FBaUI7WUFDMUIsTUFBTSxFQUFFO2dCQUNKO29CQUNJLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxJQUFJLGVBQWU7aUJBQzNDO2FBQ0o7U0FDSixDQUFDO1FBRUYsSUFBSyxNQUFNLENBQUMsS0FBSyxFQUFHO1lBQ2hCLE9BQU8sQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSSxHQUFHO2dCQUN2QixLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUs7b0JBQ1AsRUFBRSxLQUFLLENBQUUsSUFBSSxDQUFFO29CQUNmLEVBQUUsR0FBRyxDQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFFO2FBQzNDLENBQUM7U0FDTDtRQUVELFFBQVEsQ0FBQyxVQUFVLEdBQUcsS0FBSyxJQUFJLEtBQUssWUFBWSxTQUFTLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7UUFFakYsSUFBSyxLQUFLLElBQUksS0FBSyxZQUFZLFNBQVMsRUFBRztZQUN2QyxJQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUc7Z0JBQ2hCLE9BQU8sQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7YUFDN0M7WUFFRCxLQUFNLE1BQU0sQ0FBRSxHQUFHLEVBQUUsTUFBTSxDQUFFLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBRSxLQUFLLENBQUMsT0FBTyxDQUFFLEVBQUc7Z0JBQzdELEtBQU0sSUFBSSxLQUFLLElBQUksTUFBTSxFQUFHO29CQUN4QixRQUFRLENBQUMsU0FBUyxDQUFFLEdBQUcsRUFBRSxLQUFLLENBQUUsQ0FBQztpQkFDcEM7YUFDSjtTQUNKO1FBRUQsUUFBUSxDQUFDLEdBQUcsQ0FDUixNQUFNLENBQUMsS0FBSztZQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFFO1lBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFFLE9BQU8sQ0FBRSxDQUM5QixDQUFDO0lBQ04sQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=