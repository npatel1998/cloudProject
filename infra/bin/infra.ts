import * as cdk from 'aws-cdk-lib';
import { IamStack } from '../lib/iam_stack';

const app = new cdk.App();


const account ="137345587738";

const region ='ap-south-1';

if (!account) {
  throw new Error(
    'AWS account not found. Export CDK_DEFAULT_ACCOUNT (preferred) or AWS_ACCOUNT in the workflow before running CDK.'
  );
}

const env: cdk.Environment = { account, region };

// 1) Create IAM stack (defines the Lambda execution role)

const iamStack = new IamStack(app, 'IamStack', { env });


// 2) Create Lambda stack, importing the role by ARN
// if(controller.stacks.includes("FunctionStack")){
// const functionStack = new FunctionStack(app, 'FunctionStack', {
//   env,
//   // pass only the ARN (NOT the Role object)
//   lambda  lambdaRoleArn: iamStack.lambdaRole.roleArn,
// });
// }


// Optional but recommended: ensure IAM deploys before Lambda
