import React, { useState } from 'react';
// import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
// import userpool from '../utils/userpool';



const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string) => {
    // This example requires at least 8 characters.
    return value.length >= 8;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    // Handle the login logic here.
    // const user = new CognitoUser({
    //   Username: email,
    //   Pool: userpool
    // })

    // const authDetails = new AuthenticationDetails({
    //   Username: email,
    //   Password: password
    // });

    // user.authenticateUser(authDetails, {
    //   onSuccess: (data) => {
    //     console.log(`onSuccess: ${data}`);
    //   },
    //   onFailure: (err) => {
    //     console.error(`onFailure: ${err}`);
    //   },
    //   newPasswordRequired: (data) => {
    //     console.log(`newPasswordRequired: ${data}`);
    //   }
    // })
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <div className="error">{emailError}</div>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <div className="error">{passwordError}</div>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;