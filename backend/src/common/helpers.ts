import { DynamoDB } from 'aws-sdk';

const client = new DynamoDB.DocumentClient();

export interface Payload {
    appointmentId: string;
    appointment: {
      clientName: string;
      appointmentTime: string;
      barberName: string;
      status: string;
    },
    barber: {
      name: string;
      availability: string;
    }
  }
  
  export const formatForDynamoDB = (payload: Payload) => {
    const formatted = {
      appointmentId: payload.appointmentId,
      clientName: payload.appointment.clientName,
      appointmentTime: payload.appointment.appointmentTime,
      barberName: payload.appointment.barberName,
      status: payload.appointment.status,
      barber: payload.barber // This embeds the barber object.
    };
    return formatted;
  }
  

  export const writeToDynamoDB = async (tableName: string, item: any) => {
    try {
        await client.put({
            TableName: tableName,
            Item: item
        }).promise();

        console.log(`Successfully wrote item to table ${tableName}. Item:`, JSON.stringify(item));

    } catch (error) {
        console.error(`Failed to write item to table ${tableName}. Error:`, error);
        throw error; 
    }
}

export const readFromDynamoDB = async (tableName: string, key: any) => {
    try {
        const result = await client.get({
            TableName: tableName,
            Key: key
        }).promise();

        if (result.Item) {
            console.log(`Successfully retrieved item from table ${tableName} using key:`, JSON.stringify(key));
        } else {
            console.warn(`No item found in table ${tableName} using key:`, JSON.stringify(key));
        }

        return result.Item;
    } catch (error) {
        console.error(`Failed to retrieve item from table ${tableName} using key:`, JSON.stringify(key), "Error:", error);
        throw error;
    }
}


export const isValidPayload = (data: any): boolean => {
  return data &&

      // Validate appointmentId
      typeof data.appointmentId === 'string' &&

      // Validate appointment properties
      data.appointment &&
      typeof data.appointment.clientName === 'string' &&
      typeof data.appointment.appointmentTime === 'string' &&
      typeof data.appointment.barberName === 'string' &&
      ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'].includes(data.appointment.status) &&

      // Validate barber properties
      data.barber &&
      typeof data.barber.name === 'string' &&
      ['AVAILABLE', 'UNAVAILABLE', 'ON_BREAK'].includes(data.barber.availability);
}
