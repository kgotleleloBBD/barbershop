import { LambdaResponse } from '../common/models';

export const createLambdaResponse = (
    statusCode: number,
    message?: string,
    data?: any
): LambdaResponse => {
    const body: any = { message };

    if (data) {
        Object.assign(body, data);
    }

    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    };
};

export const successResponse = (
    message: string, 
    statusCode: number, 
    data?: any
): LambdaResponse => {
    return createLambdaResponse(statusCode, message, data);
};

export const errorResponse = (
    message: string, 
    statusCode: number, 
    data?: any
): LambdaResponse => {
    return createLambdaResponse(statusCode, message, data);
};
