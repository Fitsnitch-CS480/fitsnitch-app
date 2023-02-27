
/**
 * In order to interact with the db, you'll need AWS credentials
 * in your env vars. Add them to a '.env' file and they'll be set
 * automatically here.
 */
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handlers } from "./handler-paths";
import PushNotificationService from "./services/PushNotificationService";



const app = express();
app.use(cors());
app.use(bodyParser.text({type: '*/*'}));

app.get('/', (req, res) => {
	res.send("FitSnitch API");
});

app.post('/saveNotificationToken', (req, res) => {
	let { userId, token } = JSON.parse(req.body);
	console.log({ userId, token })

	PushNotificationService.updateUserEndpoint(userId, token);
	res.status(200).send('good');
})

app.post("/lambda/:path", async (req,res)=>{
    try {
        let albProxy: Partial<APIGatewayProxyEventV2> = {
            body: typeof req.body === 'object' ? JSON.stringify(req.body) : req.body
        }
        let handler = handlers[req.params.path];
        if (!handler) {
            console.log("There is no handler for path",req.params.path)
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
    console.log("Server listening on pooort "+port);
})
