import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class DynamoStack extends Stack {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.Table(this, 'MyAppTable', {
      tableName: 'MyAppTable',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,           // keep in prod
    });

    // Example GSI (optional):
    // this.table.addGlobalSecondaryIndex({
    //   indexName: 'gsi1',
    //   partitionKey: { name: 'gpk', type: dynamodb.AttributeType.STRING },
    //   sortKey: { name: 'gsk', type: dynamodb.Attribute    //   sortKey: { name: 'gsk', type: dynamodb.AttributeType.STRING },
    // });
  }
}