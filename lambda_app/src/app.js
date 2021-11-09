import { handler as lambdaRouterHandler } from 'aws-lambda-router';
import { getCardOnSiteByCardId } from './paths/index.js';

export const handler = lambdaRouterHandler({
    proxyIntegration: {
        removeBasePath: true,
        routes: [
            {
                path: '/card/on-site/{cardId}',
                method: 'GET',
                action: getCardOnSiteByCardId
            }
        ]
    }
});
