import { CognitoUserPool } from "amazon-cognito-identity-js"; 

interface PoolData {
  UserPoolId: string;
  ClientId: string;
}

const poolData: PoolData = {
  UserPoolId: "us-east-1_P7538xd0W",
  ClientId: "21fe63ik9dmvsdqla7nv7u38s0"
};

function initializeCognitoUserPool(): CognitoUserPool {
  return new CognitoUserPool(poolData);
}

export default initializeCognitoUserPool();