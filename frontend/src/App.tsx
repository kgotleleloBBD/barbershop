import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Signup from './component/Signup';
import Login from './component/Login';
import Verification from './component/Verification';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="verify/:username" element={<Verification />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
