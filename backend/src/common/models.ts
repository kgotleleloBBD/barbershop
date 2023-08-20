export interface Appointment {
  appointmentId: string;
  clientName: string;
  appointmentTime: string;
}

export interface LambdaResponse {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
}

