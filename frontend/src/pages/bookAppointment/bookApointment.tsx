import React, { useState } from 'react';
import axios from 'axios';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
}

const initialFormData: FormData = {
  fullName: 'John Doe',
  email: '',
  phone: '',
  appointmentDate: '2023-09-06',
  appointmentTime: '15:30',
};

function Book() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  
    const postData = {
      appointmentId: "A12345",
      appointment: {
        clientName: formData.fullName,
        appointmentTime: `${formData.appointmentDate}T${formData.appointmentTime}:00Z`,
        barberName: "James Smith",
        status: "SCHEDULED"
      },
      barber: {
        name: "James Smith",
        availability: "AVAILABLE"
      }
    };

    axios.post('YOUR_SERVER_ENDPOINT', postData)
      .then((response) => {
        alert("Appointment booked successfully!");
        setFormData(initialFormData); 
      })
      .catch((error) => {
        alert("Error booking appointment. Please try again.");
      });
  };

  return (
    <div className="container">
      <h1>Barber Booking Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="appointmentDate">Appointment Date:</label>
        <input
          type="date"
          id="appointmentDate"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          required
        />

        <label htmlFor="appointmentTime">Appointment Time:</label>
        <input
          type="time"
          id="appointmentTime"
          name="appointmentTime"
          value={formData.appointmentTime}
          onChange={handleChange}
          required
        />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default Book;
