import { DynamoDB } from 'aws-sdk';
import { LambdaResponse } from '../common/models';
import { isValidPayload } from '../common/helpers'; 
import {  successResponse, errorResponse } from '../common/responseHelper';

const client = new DynamoDB.DocumentClient();

export const handler = async (event: any): Promise<LambdaResponse> => {
    console.log("Received event:", JSON.stringify(event));
    if (event.Records && event.Records[0] && event.Records[0].kinesis) {
        console.log('This is a Kinesis event!');
    }

    let failedUpdates: string[] = [];

    const promises = event.Records.map(async (record) => {
        try {
            const payload = JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString());
            console.log(payload);

            // Validate if appointment has necessary properties
            if (!isValidPayload(payload)) {
                console.error('Missing necessary appointment properties:', payload);
                return;
            }
            
            const updateResponse = await client.update({
                TableName: process.env.TABLE_NAME,
                Key: { appointmentId: payload.appointmentId },
                UpdateExpression: "SET clientName = :cn, appointmentTime = :at",
                ExpressionAttributeValues: {
                    ":cn": payload.clientName,
                    ":at": payload.appointmentTime
                },
                ReturnValues: "UPDATED_NEW"
            }).promise();

            // If update didn't affect any item, it means the item doesn't exist
            if (!updateResponse.Attributes) {
                failedUpdates.push(payload.appointmentId);
                console.error(`No item found to update for appointmentId: ${payload.appointmentId}`);
            }

        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    });

    await Promise.all(promises);

    if (failedUpdates.length > 0) {
        return errorResponse("Some appointments failed to update.", 400, { failedUpdates });
    }

    return successResponse("Appointments updated successfully.", 200);
};
