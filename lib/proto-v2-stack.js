const cdk = require('@aws-cdk/core');
// const sqs = require('@aws-cdk/aws-sqs');
const lambda = require('@aws-cdk/aws-lambda');
const rds = require('@aws-cdk/aws-rds');
const ec2 = require('@aws-cdk/aws-ec2');
const iam = require('@aws-cdk/aws-iam');

const path = require('path');


class ProtoV2Stack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ProtoV2Queue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // const role = new iam.Role(this, 'lambda-iam-db-role', {
    //   assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    //   description: 'An example IAM role in AWS CDK',
    //   managedPolicies: [
    //     iam.ManagedPolicy.fromAwsManagedPolicyName(
    //       'AWSLambdaVPCAccessExecutionRole',
    //     ),
    //   ],
    // });

    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'isolated-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });

    const dbInstance = new rds.DatabaseInstance(this, 'db-instance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
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
      publiclyAccessible: false,
      
    });

    const fn = new lambda.Function(this, 'ProtoV2AppLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'src.app.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../build/lambda-app-build/lambda-app-build.zip')),
      environment: {
        "DB_HOST": dbInstance.dbInstanceEndpointAddress,
        "DB_PORT": dbInstance.dbInstanceEndpointPort,
        "DB_USER": "admin",
        "DB_PASSWORD": rds.Credentials.fromSecret(dbInstance.secret).password,
        "DB_DATABASE": "app_db"
      }
    });

    dbInstance.grantConnect(fn);
  }
}

module.exports = { ProtoV2Stack }
