
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
const client = new DynamoDBClient({region:'ap-south-1'});
const s3 = new S3Client({region:'ap-south-1'}); 
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



type LambdaEvent = {
  operation?: "get" | "put" | string;
  key?: string;
  content?: unknown; // JSON object/array or string/number
};

type LambdaResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string; // JSON string
};

// uses Lambda's IAM role & region
const BUCKET = "cdk-hnb659fds-assets-137345587738-ap-south-1";

const jsonResponse = (statusCode: number, body: unknown): LambdaResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});


export const storeDataToS3Lambda = async (event: LambdaEvent): Promise<LambdaResponse> => {
    
if (!BUCKET) {
    return jsonResponse(500, { error: "BUCKET_NAME env var not set" });
  }

  const operation = (event.operation || "").toLowerCase();
  const key = event.key;

    if (operation === "put") {
      if (event.content === undefined || event.content === null) {
        return jsonResponse(400, { error: "Missing 'content' for 'put' operation." });
      }

      let body: Buffer;
      let contentType: string;

      if (typeof event.content === "object") {
        body = Buffer.from(JSON.stringify(event.content), "utf-8");
        contentType = "application/json";
      } else {
        body = Buffer.from(String(event.content), "utf-8");
        contentType = "text/plain";
      }

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: body,
          ContentType: contentType,
        })
      );

      return jsonResponse(200, {
        message: "Object stored successfully",
        bucket: BUCKET,
        key,
        contentType,
      });
        }

    // Unreachable due to guards above
    return jsonResponse(400, { error: "Unsupported operation." });

};

export const getDataToS3Lambda = async (event: LambdaEvent): Promise<LambdaResponse> => {
    if (!BUCKET) {
    return jsonResponse(500, { error: "BUCKET_NAME env var not set" });
  }

  const operation = (event.operation || "").toLowerCase();
  const key = event.key;
try {
    if (operation === "get") {
      const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));

      // Read stream into a string
      const bytes = await res.Body?.transformToByteArray();
      const text = new TextDecoder("utf-8").decode(bytes ?? new Uint8Array());

      // Try parse as JSON, otherwise return plain text
      try {
        const parsed = JSON.parse(text);
        return jsonResponse(200, {
          bucket: BUCKET,
          key,
          content: parsed,
          contentType: "application/json",
        });
      } catch {
        return jsonResponse(200, {
          bucket: BUCKET,
          key,
          content: text,
          contentType: "text/plain",
        });
      }
    }

    // Unreachable due to guards above
    return jsonResponse(400, { error: "Unsupported operation." });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to get data from S3: ${message}`);
    return jsonResponse(500, { error: "Failed to retrieve object from S3." });
  }
};