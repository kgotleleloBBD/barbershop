import { LambdaResponse } from '../common/models';
import { successResponse, errorResponse } from '../common/responseHelper';
import { formatForDynamoDB, writeToDynamoDB, isValidPayload , Payload } from '../common/helpers';

export const handler = async (event: any): Promise<LambdaResponse> => {
    console.log("Received event:", JSON.stringify(event));
    let payload;
    if (event.Records && event.Records[0] && event.Records[0].kinesis) {
        const kinesisData = event.Records[0].kinesis.data;
        const decodedData = Buffer.from(kinesisData, 'base64').toString();
         payload = JSON.parse(decodedData);
        console.log(payload);
    }
    
    // Validate before operations
   
    
    if (!isValidPayload(payload)) {
        console.log(isValidPayload(payload));
        console.log("Invalid input");
        return errorResponse("Invalid input", 400);
        
    }
    try {
        console.log('Writting items to DDB');
        
        const dynamoDBItem = formatForDynamoDB(payload);
        await writeToDynamoDB(process.env.TABLE_NAME, dynamoDBItem);
        console.log('Done-Writting items to DDB');
        

    }
    catch (dynamoDBError) {
        console.error(dynamoDBError);

    };

    return successResponse("Appointment created successfully.", 201);
};
