import { handler as lambdaRouterHandler } from 'aws-lambda-router';
import { getCardOnSiteByCardId } from './paths/index.js';

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
                action: getCardOnSiteByCardId
            }
        ]
    }
});
