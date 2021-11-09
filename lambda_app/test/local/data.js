const event = {
  "body": "[]",
  "resource": "/card/on-site/{cardId}",
  "path": "/card/on-site/001",
  "httpMethod": "GET",
  "isBase64Encoded": true,
  "pathParameters": {
    "cardId": "001"
  },
  "requestContext": {
    "accountId": "111111111111",
    "resourceId": "111111",
    "stage": "stage",
    "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
    "requestTime": "09/Apr/2015:12:34:56 +0000",
    "requestTimeEpoch": 1428582896000,
    "identity": {
      "cognitoIdentityPoolId": null,
      "accountId": null,
      "cognitoIdentityId": null,
      "caller": null,
      "accessKey": null,
      "sourceIp": "127.0.0.1",
      "cognitoAuthenticationType": null,
      "cognitoAuthenticationProvider": null,
      "userArn": null,
      "userAgent": "Custom User Agent String",
      "user": null
    },
    "path": "/card/on-site/001",
    "resourcePath": "/{proxy+}",
    "httpMethod": "GET",
    "apiId": "1234567890",
    "protocol": "HTTP/1.1"
  }
};

export default event;