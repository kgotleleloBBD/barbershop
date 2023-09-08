import { AppointmentStatus, BarberAvailability, NotificationPreference } from "./constants";

export interface LambdaResponse {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
}

export interface Appointment {
  appointmentId: string;
  clientName: string;
  appointmentTime: string;
  barberName: string;
  status: AppointmentStatus;
}

export class BarberAppointment implements Appointment {
  appointmentId: string;
  clientName: string;
  appointmentTime: string;
  barberName: string;
  status: AppointmentStatus;

  constructor(appointmentId: string, clientName: string, appointmentTime: string, barberName: string) {
      this.appointmentId = appointmentId;
      this.clientName = clientName;
      this.appointmentTime = appointmentTime;
      this.barberName = barberName;
      this.status = AppointmentStatus.SCHEDULED;
  }

  reschedule(newTime: string) {
      this.appointmentTime = newTime;
      this.status = AppointmentStatus.RESCHEDULED;
  }

  complete() {
      this.status = AppointmentStatus.COMPLETED;
  }

  cancel() {
      this.status = AppointmentStatus.CANCELLED;
  }

}

export class Barber {
  name: string;
  availability: BarberAvailability;
  specialties?: string[];  // Optional field for things like 'beard styling', 'hair coloring' etc.

  constructor(name: string) {
      this.name = name;
      this.availability = BarberAvailability.AVAILABLE;
  }

  goOnBreak() {
      this.availability = BarberAvailability.ON_BREAK;
  }

  returnFromBreak() {
      this.availability = BarberAvailability.AVAILABLE;
  }

}
export class Client {
  name: string;
  email: string;
  phoneNumber: string;
  notificationPreference: NotificationPreference;

  constructor(name: string, email: string, phoneNumber: string, preference: NotificationPreference) {
      this.name = name;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.notificationPreference = preference;
  }

}



