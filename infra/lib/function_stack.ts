// import { Stack, StackProps, Duration } from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as lambda from 'aws-cdk-lib/aws-lambda';

// export class  FunctionStack extends Stack {
//   constructor(scope: Construct, id: string, props?: StackProps) {
//     super(scope, id, props);
 
//     const assignLambda = new lambda.Function(this, 'AssignFunction', {
//        functionName: 'MyLambdaFunction', // Lambda name
//       runtime: lambda.Runtime.NODEJS_18_X, // Runtime
//       handler: 'index.handler', // Entry point in your code
//       code: lambda.Code.fromAsset(
//        '../../service/lambda-functions/service'
//       ),
//       role: "awsAssignmentLambdaRole", // Attach IAM role
//       memorySize: 512, // Memory in MB
//       timeout: Duration.seconds(30), // Timeout
//       environment: {
//         NODE_ENV: 'production',
//         DB_TABLE: 'MyAppTable',
//         API_KEY: 'replace-with-your-key',
//       },

//     });
//     // Define Lambda resources here
//   }
// }