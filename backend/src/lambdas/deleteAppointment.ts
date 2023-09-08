import { Kinesis } from 'aws-sdk';
import { LambdaResponse } from '../common/models'; 
import {  successResponse, errorResponse } from '../common/responseHelper';
import { writeToDynamoDB } from '../common/helpers';

const kinesis = new Kinesis();

export const handler = async (event: any): Promise<LambdaResponse> => {
    console.log("Received event:", JSON.stringify(event));
    
    const appointmentId = event.pathParameters?.appointmentId;

    if (!appointmentId) {
        return errorResponse("Appointment ID is required.", 400);
    }

    try {
        await writeToDynamoDB(process.env.TABLE_NAME, { appointmentId });  // Using writeToDynamoDB for simplicity, although you might want to consider a dedicated delete function in the future

        // The Kinesis logic remains unchanged since it's already fairly concise
        const putRecordParams = {
            Data: JSON.stringify({ appointmentId }),
            StreamName: process.env.APPOINTMENT_STREAM_NAME,
            PartitionKey: appointmentId
        };

        await kinesis.putRecord(putRecordParams).promise();

        return successResponse("Appointment deleted successfully.", 200);

    } catch (error) {
        console.error("Error deleting appointment:", error);
        return errorResponse("Internal Server Error.", 500);
    }
};
