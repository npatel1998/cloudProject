
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