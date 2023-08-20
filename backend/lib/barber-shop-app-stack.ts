import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import { KinesisEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';
import { successResponseModel } from '../src/common/kinesisResponses';


import * as path from 'path';
import { App, Stack, StackProps } from 'aws-cdk-lib';


export class BarberShopAppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'AppointmentsTable', {
      partitionKey: { name: 'appointmentId', type: AttributeType.STRING },
      tableName: 'AppointmentsTable' // specifying a fixed table name
  });


    const appointmentsStream = new kinesis.Stream(this, 'AppointmentsStream');

    const getAppointmentsFunction = new NodejsFunction(this, 'GetAppointmentsHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../backend/src/lambdas/getAppointments.ts'),
      environment: {
        TABLE_NAME: table.tableName,
        APPOINTMENT_STREAM_NAME: appointmentsStream.streamName
      }
    });

    const createAppointmentFunction = new NodejsFunction(this, 'CreateAppointmentHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../backend/src/lambdas/createAppointment.ts'),
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const updateAppointmentFunction = new NodejsFunction(this, 'UpdateAppointmentHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../backend/src/lambdas/updateAppointment.ts'),
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const deleteAppointmentFunction = new NodejsFunction(this, 'DeleteAppointmentHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../backend/src/lambdas/deleteAppointment.ts'),
      environment: {
        TABLE_NAME: table.tableName,
        APPOINTMENT_STREAM_NAME: appointmentsStream.streamName
      }
    });

    //Link lambda to an event source to be triggered by an Appointment Stream
    createAppointmentFunction.addEventSource(new KinesisEventSource(appointmentsStream, {
      batchSize: 1,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON
    }));

    updateAppointmentFunction.addEventSource(new KinesisEventSource(appointmentsStream, {
      batchSize: 1,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON
    }));

   
    table.grantReadData(getAppointmentsFunction);
    table.grantWriteData(createAppointmentFunction);
    table.grantWriteData(updateAppointmentFunction);
    table.grantWriteData(deleteAppointmentFunction);

    
    //const api = new apigateway.RestApi(this, 'ApiGateway');
    const api = new apigateway.RestApi(this, 'MyApi', {
      restApiName: 'My API'
    });

    const successModel = successResponseModel(api);

    const role = new iam.Role(this, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        myPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['kinesis:PutRecord'],
              resources: [appointmentsStream.streamArn]
            })
          ]
        })
      }
    });

    const postIntegration = new apigateway.AwsIntegration({
      service: 'kinesis',
      action: 'PutRecord',
      options: {
        credentialsRole: role,
        passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
        requestParameters: {
          'integration.request.header.Content-Type': "'application/x-amz-json-1.1'",
          'integration.request.header.X-Amz-Target': "'Kinesis_20131202.PutRecord'"
        },
        requestTemplates: {
          'application/json': `{
                  "StreamName": "${appointmentsStream.streamName}",
                  "Data": "$util.base64Encode($input.json('$'))",
                  "PartitionKey": "$input.path('$.appointmentId')"
              }`
        },
        integrationResponses: [{
          statusCode: '201',
          responseTemplates: {
            'application/json': `{
                      "message": "Appointments processed successfully.",
                      "sequenceNumber": "$input.json('$.SequenceNumber')",
                      "shardId": "$input.json('$.ShardId')"
                  }`
          },
          responseParameters: {
            'method.response.header.Content-Type': "'application/json'"
          }
        }]
      }
    });

    const putIntegration = new apigateway.AwsIntegration({
      service: 'kinesis',
      action: 'PutRecord',
      options: {
        credentialsRole: role,
        passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
        requestParameters: {
          'integration.request.header.Content-Type': "'application/x-amz-json-1.1'",
          'integration.request.header.X-Amz-Target': "'Kinesis_20131202.PutRecord'"
        },
        requestTemplates: {
          'application/json': `{
                "StreamName": "${appointmentsStream.streamName}",
                "Data": "$util.base64Encode($input.json('$'))",
                "PartitionKey": "$input.path('$.appointmentId')"
            }`
        },
        integrationResponses: [{
          statusCode: '200',
          responseTemplates: {
            'application/json': `{
                    "message": "Appointments updated successfully."
                }`
          },
          responseParameters: {
            'method.response.header.Content-Type': "'application/json'"
          }
        }]
      }
    });

    const recordResource = api.root.addResource('appointment');
    const appointmentIdResource = api.root.addResource('{appointmentId}');

    const getMethod = appointmentIdResource.addMethod('GET', new apigateway.LambdaIntegration(getAppointmentsFunction), {
      requestParameters: {
        "method.request.path.appointmentId": true,
      }
    });

    const postMethod = new apigateway.Method(this, 'PostMethod', {
      httpMethod: 'POST',
      resource: recordResource,
      integration: postIntegration,
      options: {
        requestParameters: {
          "method.request.header.Content-Type": true,
        },
        requestModels: {
          'application/json': successModel
        },
        methodResponses: [{
          statusCode: '201',
          responseModels: {
            'application/json': successModel
          },
          responseParameters: {
            'method.response.header.Content-Type': true
          }
        }]
      }
    });


    // PUT Method
    const putMethod = new apigateway.Method(this, 'PutMethod', {
      httpMethod: 'PUT',
      resource: appointmentIdResource,
      integration: putIntegration,
      options: {
        requestParameters: {
          "method.request.header.Content-Type": true,
        },
        requestModels: {
          'application/json': successModel
        },
        methodResponses: [{
          statusCode: '200',
          responseModels: {
            'application/json': successModel
          },
          responseParameters: {
            'method.response.header.Content-Type': true
          }
        }]
      }
    });

    //DELETE Method
    const deleteMethod = appointmentIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteAppointmentFunction), {
      requestParameters: {
        "method.request.path.appointmentId": true,
      }
    });


}
}
  

const app = new App();
new BarberShopAppStack(app, 'BarberShopAppStack', {
  env: {
    account: '387198229710',
    region: 'af-south-1',

  }
});

  