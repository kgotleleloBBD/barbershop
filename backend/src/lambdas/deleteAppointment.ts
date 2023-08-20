import { DynamoDB, Kinesis } from 'aws-sdk';
import { LambdaResponse } from '../common/models';

const client = new DynamoDB.DocumentClient();
const kinesis = new Kinesis();

export const handler = async (event: any): Promise<LambdaResponse> => {
    console.log("Received event:", JSON.stringify(event));
    console.log("Path Parameters:", event.pathParameters);
    console.log("Appointment ID:", event.pathParameters?.appointmentId);

    const appointmentId = event.pathParameters?.appointmentId;

    try {
        // Delete from DynamoDB
        await client.delete({
            TableName: process.env.TABLE_NAME,
            Key: { appointmentId }
        }).promise();

        // Send the deleted appointment ID to Kinesis
        const putRecordParams = {
            Data: JSON.stringify({ appointmentId }),
            StreamName: process.env.APPOINTMENT_STREAM_NAME,
            PartitionKey: appointmentId  // Using the appointment ID as the partition key
        };

        await kinesis.putRecord(putRecordParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Appointment deleted successfully." }),
            headers: {
                "Content-Type": "application/json"
            }
        };

    } catch (error) {
        console.error("Error deleting appointment:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error." }),
            headers: {
                "Content-Type": "application/json"
            }
        };
    }
};
