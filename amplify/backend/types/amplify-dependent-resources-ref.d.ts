export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "fitsnitchfrontendb5f16d0d": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "function": {
        "dynamoDBFitTrigger33609f5d": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "lambdaApiFunctionFit": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "storage": {
        "dynamoDBFit": {
            "Name": "string",
            "Arn": "string",
            "StreamArn": "string",
            "PartitionKeyName": "string",
            "PartitionKeyType": "string",
            "Region": "string"
        }
    },
    "api": {
        "apiFit": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}