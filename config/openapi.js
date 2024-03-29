const openApi = require('./openapi.json');
const options = require('./options.json');

const getOpenApi = (accountId, region, functionName) => {
  const paths = Object.keys(openApi.paths);

  paths.forEach((path) => {
    openApi.paths[path][Object.keys(openApi.paths[path])[0]][
      'x-amazon-apigateway-integration'
    ].uri = openApi.paths[path][Object.keys(openApi.paths[path])[0]][
      'x-amazon-apigateway-integration'
    ].uri.replace('(ACCOUNT_ID)', accountId);

    openApi.paths[path][Object.keys(openApi.paths[path])[0]][
      'x-amazon-apigateway-integration'
    ].uri = openApi.paths[path][Object.keys(openApi.paths[path])[0]][
      'x-amazon-apigateway-integration'
    ].uri
      .replace('(REGION)', region)
      .replace('(REGION)', region);

    openApi.paths[path][Object.keys(openApi.paths[path])[0]][
      'x-amazon-apigateway-integration'
    ].uri = openApi.paths[path][Object.keys(openApi.paths[path])[0]][
      'x-amazon-apigateway-integration'
    ].uri.replace('(FUNCTION_NAME)', functionName);

    openApi.paths[path] = { ...openApi.paths[path], options };
  });

  openApi['x-amazon-apigateway-policy'].Statement[0].Resource = openApi[
    'x-amazon-apigateway-policy'
  ].Statement[0].Resource.replace('(ACCOUNT_ID)', accountId);

  openApi['x-amazon-apigateway-policy'].Statement[0].Resource = openApi[
    'x-amazon-apigateway-policy'
  ].Statement[0].Resource.replace('(REGION)', region);

  return openApi;
};

module.exports = { getOpenApi };
