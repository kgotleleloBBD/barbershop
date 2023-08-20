import { DynamoDB, Kinesis } from 'aws-sdk';
import { LambdaResponse } from '../common/models';

const client = new DynamoDB.DocumentClient();
const kinesis = new Kinesis();

export const handler = async (event: any): Promise<LambdaResponse> => {
    console.log("Received event:", JSON.stringify(event));
    console.log("Path Parameters:", event.pathParameters);
    console.log("Appointment ID:", event.pathParameters?.appointmentId);

    if (!event || !event.pathParameters || !event.pathParameters.appointmentId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid input" }),
            headers: {
                "Content-Type": "application/json"
            }
        };
    }

    try {
        const result = await client.get({
            TableName: process.env.TABLE_NAME,
            Key: { 'appointmentId': event.pathParameters.appointmentId }
        }).promise();

        console.log('Result returned is:', result);
        console.log('Item returned is:', result.Item);
        
        if (result.Item) {
            // Send fetched item to Kinesis stream
            const putRecordParams = {
                Data: JSON.stringify(result.Item),
                StreamName: process.env.APPOINTMENT_STREAM_NAME,
                PartitionKey: result.Item.appointmentId  // Using the appointment ID as the partition key
            };

            await kinesis.putRecord(putRecordParams).promise();

            return {
                statusCode: 200,
                body: JSON.stringify(result.Item),
                headers: {
                    "Content-Type": "application/json"
                }
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Not found" }),
                headers: {
                    "Content-Type": "application/json"
                }
            };
        }

    } catch (error) {
        console.error(`Error fetching data for ID ${event.pathParameters.appointmentId}:`, error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
            headers: {
                "Content-Type": "application/json"
            }
        };
    }
};
