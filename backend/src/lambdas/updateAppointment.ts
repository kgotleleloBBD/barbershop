import { DynamoDB } from 'aws-sdk';
import { Appointment, LambdaResponse } from '../common/models';

const client = new DynamoDB.DocumentClient();

export const handler = async (event: any): Promise<LambdaResponse> => {
    console.log("Received event:", JSON.stringify(event));
    if (event.Records && event.Records[0] && event.Records[0].kinesis) {
        console.log('This is a Kinesis event!');
    }

    let failedUpdates: string[] = [];

    const promises = event.Records.map(async (record) => {
        try {
            const appointment: Appointment = JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString());

            // Validate if appointment has necessary properties
            if (!appointment.appointmentId || !appointment.clientName || !appointment.appointmentTime) {
                console.error('Missing necessary appointment properties:', appointment);
                return;
            }

            const updateResponse = await client.update({
                //TableName: "BarberShopAppStack-AppointmentsTable8553CB1E-1PPHVPBHA24RJ",
                TableName: process.env.TABLE_NAME,
                Key: { appointmentId: appointment.appointmentId },
                UpdateExpression: "SET clientName = :cn, appointmentTime = :at",
                ExpressionAttributeValues: {
                    ":cn": appointment.clientName,
                    ":at": appointment.appointmentTime
                },
                ReturnValues: "UPDATED_NEW"
            }).promise();

            // If update didn't affect any item, it means the item doesn't exist
            if (!updateResponse.Attributes) {
                failedUpdates.push(appointment.appointmentId);
                console.error(`No item found to update for appointmentId: ${appointment.appointmentId}`);
            }

        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    });

    await Promise.all(promises);

    if (failedUpdates.length > 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Some appointments failed to update.", failedUpdates }),
            headers: {
                "Content-Type": "application/json"
            }
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Appointments updated successfully." }),
        headers: {
            "Content-Type": "application/json"
        }
    };
};
