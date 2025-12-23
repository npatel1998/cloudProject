import * as cdk from 'aws-cdk-lib';
import { IamStack } from '../lib/iam_stack';
import { FunctionStack } from '../lib/function_stack';
import { DynamoStack } from '../lib/dynamo_stack';
import { S3Stack } from '../lib/s3_stack';  
import { GraphqlStack } from '../lib/appSync_stack';

const app = new cdk.App();

const account ="137345587738";
const region ='ap-south-1';

if (!account) {
  throw new Error(
    'AWS account not found. Export CDK_DEFAULT_ACCOUNT (preferred) or AWS_ACCOUNT in the workflow before running CDK.'
  );
}

const env: cdk.Environment = { account, region };

// let iamStack = new IamStack(app, 'IamStack', { env });
// let functionStack = new FunctionStack(app, 'FunctionStack', { env });
// let dynamoStack =   new DynamoStack(app, 'DynamoStack', { env });

// 1) Create IAM stack (defines the Lambda execution role)
if(controller.stacks.includes("IamStack")){
 const iamStack = new IamStack(app, 'IamStack', { env });
}


const appSyncStack = new GraphqlStack(app, 'AppSyncStack', { env });
// 2) Create Lambda stack, importing the role by ARN
// if(controller.stacks.includes("FunctionStack")){
 const functionStack = new FunctionStack(app, 'FunctionStack', {
  env,  
});
// if (iamStack) functionStack.addDependency(iamStack);
// }

// 3) Create DynamoDB stack
// if(controller.stacks.includes("DynamoStack")){
// const dynamoStack = new DynamoStack(app, 'DynamoStack', { env });
// }

const s3Stack = new S3Stack(app, 'S3Stack', { env });
// Optional but recommended: ensure IAM deploys before Lambda
