const openApi = require('./openapi.json');

const getOpenApi = (accountId, region, functionName) => {
    openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri = openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri.replace("(ACCOUNT_ID)", accountId);

    openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri = openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri.replace("(REGION)", region).replace("(REGION)", region);

    openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri = openApi.paths['/webhook'].post['x-amazon-apigateway-integration'].uri.replace("(FUNCTION_NAME)", functionName);

    openApi['x-amazon-apigateway-policy'].Statement[0].Resource = openApi['x-amazon-apigateway-policy'].Statement[0].Resource.replace("(ACCOUNT_ID)", accountId);

    openApi['x-amazon-apigateway-policy'].Statement[0].Resource = openApi['x-amazon-apigateway-policy'].Statement[0].Resource.replace("(REGION)", region)

    return openApi;
}

module.exports = { getOpenApi };