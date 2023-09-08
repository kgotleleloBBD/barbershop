import React, { useEffect, useState } from 'react';
import './viewBooking.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const Appointment: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();

  const [appointmentData, setAppointmentData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`https://2ajcrf8zxc.execute-api.af-south-1.amazonaws.com/prod/${appointmentId}`);
        setAppointmentData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [appointmentId]);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Cute Appointment Details</h1>
      <table className="cute-table">
        <caption>Appointment Details</caption>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {appointmentData && (
            <>
              <tr>
                <td>Appointment ID</td>
                <td>{appointmentData.appointmentId}</td>
              </tr>
              <tr>
                <td>Barber Name</td>
                <td>{appointmentData.barberName}</td>
              </tr>
              <tr>
                <td>Client Name</td>
                <td>{appointmentData.clientName}</td>
              </tr>
              <tr>
                <td>Appointment Time</td>
                <td>{appointmentData.appointmentTime}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{appointmentData.status}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};


export default Appointment ;
