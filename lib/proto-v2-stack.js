const cdk = require('@aws-cdk/core');
// const sqs = require('@aws-cdk/aws-sqs');
const lambda = require('@aws-cdk/aws-lambda');
const rds = require('@aws-cdk/aws-rds');
const ec2 = require('@aws-cdk/aws-ec2');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');
const openapiJs = require('../config/openapi.js');

const path = require('path');
const dotenv = require('dotenv');
dotenv.config();


class ProtoV2Stack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 3
    });

    const dbInstance = new rds.DatabaseInstance(this, 'db-instance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      },
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_5_7_34,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.SMALL,
      ),
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: 'app_db',
      publiclyAccessible: true      
    });

    const fn = new lambda.Function(this, 'ProtoV2AppLambda', {
      functionName: "iot-prototype-v2-app",
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../build/lambda-app-build/lambda-app-build.zip')),
      environment: {
        "DB_HOST": dbInstance.dbInstanceEndpointAddress,
        "DB_PORT": dbInstance.dbInstanceEndpointPort,
        "DB_USER": "admin",
        "DB_PASSWORD": rds.Credentials.fromSecret(dbInstance.secret).password,
        "DB_DATABASE": "app_db",
        PARTICLE_DEVICE_ID: process.env.PARTICLE_DEVICE_ID,
        PARTICLE_TOKEN: process.env.PARTICLE_TOKEN
      },
      timeout: cdk.Duration.minutes(5)
    });

    dbInstance.connections.allowDefaultPortFromAnyIpv4();

    dbInstance.grantConnect(fn);

    const swagger = openapiJs.getOpenApi(cdk.Stack.of(this).account, cdk.Stack.of(this).region, fn.functionName);

    const api = new apigateway.SpecRestApi(this, 'ProtoV2API', {
      apiDefinition: apigateway.ApiDefinition.fromInline(swagger),
      restApiName: `proto-v2-api`,
      deploy: true
    });

    fn.addPermission('ProtoV2ApiGatewayInvoke', {
      principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: `arn:aws:execute-api:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:${api.restApiId}/*`,
    });
  }
}

module.exports = { ProtoV2Stack }
