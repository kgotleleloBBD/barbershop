import { LambdaResponse } from '../common/models'; 
import {  successResponse, errorResponse } from '../common/responseHelper';
import { readFromDynamoDB } from '../common/helpers';

export const handler = async (event: any): Promise<LambdaResponse> => {
    console.log("Received event:", JSON.stringify(event));
    
    if (!event.pathParameters || !event.pathParameters.appointmentId) {
        return errorResponse("Invalid input: Missing appointmentId", 400);
    }

    try {
        const resultItem = await readFromDynamoDB(process.env.TABLE_NAME, { 'appointmentId': event.pathParameters.appointmentId });

        if (resultItem) {
            return successResponse("Appointment retrieved successfully.", 200, resultItem);
        } else {
            return errorResponse("Appointment not found", 404);
        }

    } catch (error) {
        console.error(`Error fetching data for ID ${event.pathParameters.appointmentId}:`, error);
        return errorResponse("Internal Server Error", 500);
    }
};
