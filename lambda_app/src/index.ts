import { handler as lambdaRouterHandler } from 'aws-lambda-router';
import { getCardOnSiteByCardId, tapCard, setup } from './paths/index';

export const handler = lambdaRouterHandler({
    proxyIntegration: {
        removeBasePath: true,
        routes: [
            {
                path: '/card/on-site/{cardId}',
                method: 'GET',
                action: getCardOnSiteByCardId
            },
            {
                path: '/card/tap',
                method: 'POST',
                action: tapCard
            },
            {
                path: '/webhook',
                method: 'POST',
                action: async (request, context) => {
                    console.log("POST /webhook called");
                    console.log(request.body);
                    return "You called me";
                } 
            },
            {
                path: '/setup',
                method: 'GET',
                action: 
            }
        ]
    }
});
