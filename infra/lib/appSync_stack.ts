import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class GraphqlStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // AppSync API
    const api = new appsync.GraphqlApi(this, 'MyApi', {
      name: 'MyGraphqlApi',
      schema: appsync.SchemaFile.fromAsset('schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });

    // Import existing DynamoDB table by name
    const table = dynamodb.Table.fromTableName(this, 'ImportedTable', 'MyAppTable');

    // Attach DynamoDB as data source
    const dataSource = api.addDynamoDbDataSource('ItemsDataSource', table);

    // Example resolvers
    dataSource.createResolver('GetItemResolver', {
      typeName: 'Query',
      fieldName: 'getItem',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem('id', 'id'),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    dataSource.createResolver('ListItemsResolver', {
      typeName: 'Query',
      fieldName: 'listItems',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });

    dataSource.createResolver('AddItemResolver', {
      typeName: 'Mutation',
      fieldName: 'addItem',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition('id').is('id'),
        appsync.Values.projecting('ctx.args')
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    // Outputs
    new cdk.CfnOutput(this, 'GraphQLAPIURL', { value: api.graphqlUrl });
    new cdk.CfnOutput(this, 'GraphQLAPIKey', { value: api.apiKey! });
  }
}