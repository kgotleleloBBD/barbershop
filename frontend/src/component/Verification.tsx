import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CognitoUser,
  CognitoUserPool,
  ICognitoUserData,
} from "amazon-cognito-identity-js";
import { useNavigate } from 'react-router-dom';
import './Verification.css';

const Verification: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate('/signup');
    }
  }, [username, navigate]);

  const handleVerification = () => {
    if (!username) {
      navigate('/signup');
      return;
    }

    const userPoolId = "us-east-1_P7538xd0W";
    const clientId = "21fe63ik9dmvsdqla7nv7u38s0";

    const poolData = {
      UserPoolId: userPoolId,
      ClientId: clientId,
    };

    const userData: ICognitoUserData = {
      Username: username,
      Pool: new CognitoUserPool(poolData),
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        console.error("Verification failed:", err);
        navigate('/signup');
      } else {
        console.log("Verification successful:", result);
        navigate('/login');
      }
    });
  };

  return (
    <div className="center-container"> {/* Apply centering to the container */}
      <h2>Verification</h2>
      <p>Enter the verification code sent to your email:</p>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerification}>Verify</button>
    </div>
  );
};

export default Verification;