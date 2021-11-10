const openApi = require('./openapi.json');

const getOpenApi = (accountId, region, functionName) => {
    // /webhook
    openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri = openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri.replace("(ACCOUNT_ID)", accountId);

    openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri = openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri.replace("(REGION)", region).replace("(REGION)", region);

    openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri = openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri.replace("(FUNCTION_NAME)", functionName);

    // /card/on-site/{cardId}
    openApi.paths['/card/on-site/{cardId}'].get['x-amazon-apigateway-integration'].uri = openApi.paths['/card/on-site/{cardId}'].get['x-amazon-apigateway-integration'].uri.replace("(ACCOUNT_ID)", accountId);

    openApi.paths['/card/on-site/{cardId}'].get['x-amazon-apigateway-integration'].uri = openApi.paths['/card/on-site/{cardId}'].get['x-amazon-apigateway-integration'].uri.replace("(REGION)", region).replace("(REGION)", region);

    openApi.paths['/card/on-site/{cardId}'].get['x-amazon-apigateway-integration'].uri = openApi.paths['/card/on-site/{cardId}'].get['x-amazon-apigateway-integration'].uri.replace("(FUNCTION_NAME)", functionName);

    // /card/tap
    openApi.paths['/card/tap'].post['x-amazon-apigateway-integration'].uri = openApi.paths['/card/tap'].post['x-amazon-apigateway-integration'].uri.replace("(ACCOUNT_ID)", accountId);

    openApi.paths['/card/tap'].post['x-amazon-apigateway-integration'].uri = openApi.paths['/card/tap'].post['x-amazon-apigateway-integration'].uri.replace("(REGION)", region).replace("(REGION)", region);

    openApi.paths['/card/tap'].post['x-amazon-apigateway-integration'].uri = openApi.paths['/card/tap'].post['x-amazon-apigateway-integration'].uri.replace("(FUNCTION_NAME)", functionName);

    // /setup
    openApi.paths['/setup'].get['x-amazon-apigateway-integration'].uri = openApi.paths['/setup'].get['x-amazon-apigateway-integration'].uri.replace("(ACCOUNT_ID)", accountId);

    openApi.paths['/setup'].get['x-amazon-apigateway-integration'].uri = openApi.paths['/setup'].get['x-amazon-apigateway-integration'].uri.replace("(REGION)", region).replace("(REGION)", region);

    openApi.paths['/setup'].get['x-amazon-apigateway-integration'].uri = openApi.paths['/setup'].get['x-amazon-apigateway-integration'].uri.replace("(FUNCTION_NAME)", functionName);

    // /teardown
    openApi.paths['/teardown'].get['x-amazon-apigateway-integration'].uri = openApi.paths['/teardown'].get['x-amazon-apigateway-integration'].uri.replace("(ACCOUNT_ID)", accountId);

    openApi.paths['/teardown'].get['x-amazon-apigateway-integration'].uri = openApi.paths['/teardown'].get['x-amazon-apigateway-integration'].uri.replace("(REGION)", region).replace("(REGION)", region);

    openApi.paths['/teardown'].get['x-amazon-apigateway-integration'].uri = openApi.paths['/teardown'].get['x-amazon-apigateway-integration'].uri.replace("(FUNCTION_NAME)", functionName);

    // api gateway policy
    openApi['x-amazon-apigateway-policy'].Statement[0].Resource = openApi['x-amazon-apigateway-policy'].Statement[0].Resource.replace("(ACCOUNT_ID)", accountId);

    openApi['x-amazon-apigateway-policy'].Statement[0].Resource = openApi['x-amazon-apigateway-policy'].Statement[0].Resource.replace("(REGION)", region)

    return openApi;
}

module.exports = { getOpenApi };