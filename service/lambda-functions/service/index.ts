
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({region:'ap-south-1'});
const ddbDocClient = DynamoDBDocumentClient.from(client);

console.log("dynmoClient",ddbDocClient)

// Define the shape of the input event
type OrderEvent = {
    order_id: string;
    amount: number;
    item: string;
}
export const assignLambda = async (event: OrderEvent): Promise<string> => {
    try {
        
        // Create the receipt content and key destination
        const receiptContent = `OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`;
        const key = `receipts/${event.order_id}.txt`;

        // Upload the receipt to S3
        // await uploadReceiptToS3(bucketName, key, receiptContent);

        return 'Success';
    } catch (error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};

export const createDataLambda = async (event: OrderEvent): Promise<string> => {
    try {
        const params = {
            TableName: "MyAppTable",
            Item: {
                id: event.order_id,
                amount: event.amount,
                item: event.item
            }
        };
        await ddbDocClient.send(new PutCommand(params));
        return 'Success';
    } catch (error) {
        console.error(`Failed to create data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};
       


export const getDataLambda = async (event: OrderEvent): Promise<string> => {
  try {
    const TableName = "MyAppTable";
    if (!TableName) {
      throw new Error('Environment variable DB_TABLE is not set');
    }
    if (!event?.order_id) {
      throw new Error('Missing required field: order_id');
    }

    // Read the item by partition key
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName,
        Key: { id: event.order_id }, // <- must match your table's PK name
        ConsistentRead: true,               // optional: strongly consistent read
      })
    );

    if (!Item) {
      // Not found: return a 404-style message or throw based on your preference
      console.warn(`Item not found for order_id=${event.order_id}`);
      return JSON.stringify({ found: false, order_id: event.order_id });
    }

    // Return item as JSON string (or shape it as needed)
    return JSON.stringify({ found: true, item: Item });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to get data from DynamoDB: ${message}`);
    throw error;
  }
};



export const updateDataLambda = async (event: OrderEvent): Promise<string> => {
    try {
        
        // Create the receipt content and key destination
        const receiptContent = `OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`;
        const key = `receipts/${event.order_id}.txt`;

        // Upload the receipt to S3
        // await uploadReceiptToS3(bucketName, key, receiptContent);

        return 'Success';
    } catch (error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};

export const deleteDataLambda = async (event: OrderEvent): Promise<string> => {
    try {
        
        // Create the receipt content and key destination
        const receiptContent = `OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`;
        const key = `receipts/${event.order_id}.txt`;

        // Upload the receipt to S3
        // await uploadReceiptToS3(bucketName, key, receiptContent);

        return 'Success';
    } catch (error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};