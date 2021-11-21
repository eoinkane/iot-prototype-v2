import { handler as lambdaRouterHandler } from 'aws-lambda-router';
import { getCardOnSiteByCardId, tapCard, setup, teardown, getStaff, getStaffByStaffId, getStaffOnSite } from './paths/index';

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
      {
        path: '/staff',
        method: 'GET', 
        action: getStaff
      },
      {
        path: '/staff/on-site',
        method: 'GET', 
        action: getStaffOnSite
      },
      {
        path: '/staff/{staffId}',
        method: 'GET', 
        action: getStaffByStaffId
      },
];

export const handler = lambdaRouterHandler({
  proxyIntegration: {
    cors: true,
    removeBasePath: true,
    routes,
  },
});
