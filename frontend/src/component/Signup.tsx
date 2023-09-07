import React, { useState } from 'react';
import userpool from '../utils/userpool';

interface SignupData {
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    email: '',
    password: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Validate the email and password fields as the user types
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    switch (name) {
      case 'email':
        if (!emailRegex.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: 'Invalid email address',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: '',
          }));
        }
        break;
      case 'password':
        if (!passwordRegex.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password:
              'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: '',
          }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if there are any validation errors before submitting
    if (Object.values(errors).every((error) => error === '')) {
      // Here, you can send the email and password to your server for processing
      userpool.signUp(formData.email, formData.password, [], [], (err, data) => {
        if(err) {
          console.log(err)
        }
        else {
          console.log(data)
        }
      });
      console.log(formData);
    } else {
      console.error('Form has validation errors');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;