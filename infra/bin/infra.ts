const cdk = require('aws-cdk-lib');
const { IamStack } = require('../lib/iam_stack');
const { FunctionStack } = require('../lib/function_stack');
import controller from './controller.json';
const app = new cdk.App();

// CDK picks these from your GitHub environment secrets
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
//
// 1) Create IAM stack (defines the Lambda execution role)
if(controller.stacks.includes("IamStack")){
const iamStack = new IamStack(app, 'IamStack', { env });
}

// 2) Create Lambda stack, importing the role by ARN
if(controller.stacks.includes("FunctionStack")){
const functionStack = new FunctionStack(app, 'FunctionStack', {
  env,
  // pass only the ARN (NOT the Role object)
  lambda  lambdaRoleArn: iamStack.lambdaRole.roleArn,
});
}


// Optional but recommended: ensure IAM deploys before Lambda
