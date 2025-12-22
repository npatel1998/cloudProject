import * as path from 'path';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class  FunctionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
 
  const assetDir = path.resolve(__dirname, '..', '..', 'service', 'lambda-functions', 'dist');
// Import the existing role and attach it to the Lambda
const assignmentRole = iam.Role.fromRoleArn(
  this,
  'ImportedAssignmentLambdaRole',
  'arn:aws:iam::137345587738:role/awsAssignmentLambdaRole',
  {
    // keep immutable if the role is managed outside this stack
    mutable: false,
  }
);

    const assignLambda = new lambda.Function(this, 'AssignFunction', {
       functionName: 'getReports', // Lambda name
      runtime: lambda.Runtime.NODEJS_22_X, // Runtime
      handler: 'service/index.handler', // Entry point in your code
      code:lambda.Code.fromAsset(assetDir),      
      role: assignmentRole, // Attach IAM role
      memorySize: 512, // Memory in MB
      timeout: Duration.seconds(30), // Timeout
      environment: {
        NODE_ENV: 'production',
        DB_TABLE: 'MyAppTable',
        API_KEY: 'replace-with-your-key',
      },

    });
    // Define Lambda resources here
  }
}