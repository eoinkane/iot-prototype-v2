import { handler as lambdaRouterHandler } from 'aws-lambda-router';
import { getCardOnSiteByCardId, tapCard, setup, teardown } from './paths/index';

export const routes: {
  path: string;
  method: 'GET' | 'POST';
  action: (request: any, context: any) => Promise<any>;
}[] = [
    {
        path: '/card/on-site/{cardId}',
        method: 'GET',
        action: getCardOnSiteByCardId,
      },
      {
        path: '/card/tap',
        method: 'POST',
        action: tapCard,
      },
      {
        path: '/webhook',
        method: 'POST',
        action: async (request, context) => {
          console.log('POST /webhook called');
          console.log(request.body);
          return 'You called me';
        },
      },
      {
        path: '/setup',
        method: 'GET',
        action: setup,
      },
      {
        path: '/teardown',
        method: 'GET',
        action: teardown,
      },
];

export const handler = lambdaRouterHandler({
  proxyIntegration: {
    removeBasePath: true,
    routes,
  },
});
