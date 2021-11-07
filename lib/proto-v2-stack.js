const cdk = require('@aws-cdk/core');
// const sqs = require('@aws-cdk/aws-sqs');

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
  }
}

module.exports = { ProtoV2Stack }
