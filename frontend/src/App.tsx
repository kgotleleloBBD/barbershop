import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Home from './component/Home';
import Signup from './component/Signup';
import Login from './component/Login';
import Verification from './component/Verification';
import Book from './pages/bookAppointment/bookApointment';
import Appointment from './pages/viewBooking/viewBooking';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="verify/:username" element={<Verification />} />
        <Route path='/booking' element={<Book />} />
        <Route path='/viewbooking/:appointmentId' element={<Appointment />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
