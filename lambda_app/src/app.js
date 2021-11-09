import { handler as lambdaRouterHandler } from 'aws-lambda-router';

export const handler = lambdaRouterHandler({
    proxyIntegration: {
        // assumes the first path part is `stage` and removes it.
        removeBasePath: true,
        routes: [
            {
                // request-path-pattern with a path variable:
                path: '/card/on-site/{cardId}',
                method: 'GET',
                // we can use the path param 'cardId' in the action call:
                action: async (request, context) => {
                    return "You called me with: " + request.paths.cardId;
                }
            }
        ]
    }
});
