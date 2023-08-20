import { DynamoDB } from 'aws-sdk';
import { LambdaResponse } from '../common/models';

const client = new DynamoDB.DocumentClient();

export const handler = async (event: any): Promise<LambdaResponse> => {

    console.log("Received event:", JSON.stringify(event));
    if (event.Records && event.Records[0] && event.Records[0].kinesis) {
        console.log('This is a Kinesis event!');
    }

    const promises = event.Records.map(async (record) => {
        const appointment = JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString());

        return client.put({
            TableName:  process.env.TABLE_NAME,
            Item: appointment
        }).promise();
    });

    await Promise.all(promises);

    return {
        statusCode: 201,
        body: JSON.stringify({ message: "Appointments processed successfully." }),
        headers: {
            "Content-Type": "application/json"
        }
    };
};
