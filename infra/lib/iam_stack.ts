
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

class IamStack extends Stack {
  public readonly lambdaRole: iam.Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      roleName: 'awsAssignmentLambdaRole',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Execution role for MyLambdaFunction',
    });

    /** ✅ Basic Lambda logging (required) */
    this.lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      )
    );

    /** ✅ Example: DynamoDB table access */
    this.lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:Query',
          'dynamodb:Scan',
        ],
        resources: [
          `arn:aws:dynamodb:${this.region}:${this.account}:table/MyAppTable`
        ],
      })
    );

    /** ✅ Example: Access Secrets Manager */
    this.lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        resources: [
          `arn:aws:secretsmanager:${this.region}:${this.account}:secret:my-app/*`,
        ],
      })
    );

    /** ✅ Example: Allow S3 read/write */
    this.lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject'],
        resources: ['arn:aws:s3:::my-app-bucket/*'],
      })
    );
  }
}
export { IamStack };