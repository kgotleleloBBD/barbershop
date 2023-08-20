// kinesisResponses.ts

import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export const successResponseModel = (api: apigateway.RestApi): apigateway.Model => {
  return new apigateway.Model(api.stack, 'SuccessResponseModel', {
    restApi: api,
    contentType: 'application/json',
    modelName: 'SuccessResponse',
    schema: {
      schema: apigateway.JsonSchemaVersion.DRAFT4,
      title: 'successResponse',
      type: apigateway.JsonSchemaType.OBJECT,
      properties: {
        message: { type: apigateway.JsonSchemaType.STRING },
        sequenceNumber: { type: apigateway.JsonSchemaType.STRING },
        shardId: { type: apigateway.JsonSchemaType.STRING }
      }
    }
  });
};

export const methodResponse = (api: apigateway.RestApi) : apigateway.MethodResponse[] => [{
  statusCode: '200',
  responseModels: {
    'application/json': successResponseModel(api)
  }
}];

export const integrationResponse: apigateway.IntegrationResponse[] = [{
  statusCode: '200',
  responseTemplates: {
    'application/json': `{
      "message": "Data sent successfully.",
      "sequenceNumber": "$input.path('$.SequenceNumber')",
      "shardId": "$input.path('$.ShardId')"
    }`
  }
}];
