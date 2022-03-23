/**
 * A simple server for local development. Exposes the lambda-api
 * handler and acts like the AWS Application Load Balancer that fields
 * real requests to the Staging and Prod servers.
 */

import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handlers } from "./handler-paths";


/**
 * In order to interact with the db, you'll need AWS credentials
 * in your env vars. Add them to a '.env' file and they'll be set
 * automatically here.
 */
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.text({type: '*/*'}));

app.post("/:path", async (req,res)=>{
    try {
        let albProxy: Partial<APIGatewayProxyEventV2> = {
            body: typeof req.body === 'object' ? JSON.stringify(req.body) : req.body
        }
        let handler = handlers[req.path];
        if (!handler) {
            console.log("There is no handler for path",req.path)
            return res.sendStatus(404)
        }
        
        let proxyRes = await handler(albProxy as APIGatewayProxyEventV2)
        res.status(proxyRes.statusCode || 200);
        if (proxyRes.headers) {
            for (let [header,val] of Object.entries(proxyRes.headers)) {
                if (typeof val === 'boolean'){
                    val = String(val);
                }
                res.setHeader(header,val)
            }
        }
        res.send(proxyRes.body);
    
    }
    catch (e:any) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

let port = 4000;
app.listen(port, ()=>{
    console.log("Server listening on port "+port);
})
