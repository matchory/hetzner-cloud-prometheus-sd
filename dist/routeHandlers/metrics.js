import client from 'prom-client';
export const metrics = (config, dataStore) => {
    return async function metricsRouteHandler(request, response) {
        const payload = await client.register.metrics();
        response.removeHeader('Content-Type');
        response.setHeader('Content-Type', 'text/plain');
        response.end(payload);
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZUhhbmRsZXJzL21ldHJpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxNQUFNLE1BQU0sYUFBYSxDQUFDO0FBS2pDLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxDQUFFLE1BQWMsRUFBRSxTQUE4QixFQUFvQixFQUFFO0lBQ3pGLE9BQU8sS0FBSyxVQUFVLG1CQUFtQixDQUNyQyxPQUFPLEVBQ1AsUUFBUTtRQUVSLE1BQU0sT0FBTyxHQUFHLE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoRCxRQUFRLENBQUMsWUFBWSxDQUFFLGNBQWMsQ0FBRSxDQUFDO1FBQ3hDLFFBQVEsQ0FBQyxTQUFTLENBQUUsY0FBYyxFQUFFLFlBQVksQ0FBRSxDQUFDO1FBQ25ELFFBQVEsQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFFLENBQUM7SUFDNUIsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=