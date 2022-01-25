# FitSnitch-Backend

## TS and AWS

This module is written in Typescript and should be bundled to JavaScript packages before being deployed to AWS Lambda.

The following command compiles the code using Webpack and the options in `tsconfig.json` and `webpack.config.js`.

```
$ npm run build
```

The code generally refelcts the example in [this blog article](https://blog.atj.me/2017/10/bundle-lambda-functions-using-webpack/), with some modifications for Typescript and bundling multiple packages at once.


This [blog article](https://scotch.io/@nwayve/how-to-build-a-lambda-function-in-typescript) gives a decent example of a simple Lambda Function written in Typescript. The example looks like this:

``` ts
export const handler = async (event: any = {}): Promise<any> => {
    console.log('Hello World!');
    const response = JSON.stringify(event, null, 2);
    return response;
}
```

A similar example using the API Gateway types:

``` ts
import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const queries = JSON.stringify(event.queryStringParameters);
  return {
    statusCode: 200,
    body: `Queries: ${queries}`
  }
}
```
