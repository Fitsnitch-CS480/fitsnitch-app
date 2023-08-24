import { APIGatewayProxyEventV2 } from "aws-lambda";
import express from "express";
import { handlers } from "../handler-paths";
import bodyParser from "body-parser";
import { catchErrors } from "../utils/catchErrors";

const LambdaRouter = express();
LambdaRouter.use(bodyParser.text({type: '*/*'}));

LambdaRouter.post("/:path", catchErrors(async (req,res)=>{
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
}));


export default LambdaRouter;