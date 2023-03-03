import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export default class LambaUtils {
    public static parseEventBody<T>(body: string): T {
        return JSON.parse(body) as T;
    }

    
    public static async handleEventWithBody<TBody>(event: APIGatewayProxyEventV2, handler:(body:TBody, res:ProxyResultWrapper)=>Promise<ProxyResultWrapper>): Promise<ProxyResultWrapper> {
        let res: ProxyResultWrapper = new ProxyResultWrapper();
        if (!event.body) {
            return res.setCode(400).setBodyToMessage("Lambda event had no body!");
        };
        let body = JSON.parse(event.body) as TBody;
        return await handler(body, res);
    }

}

export class ProxyResultWrapper implements APIGatewayProxyStructuredResultV2 {
    statusCode?: number;
    headers?: {
        [header: string]: boolean | number | string;
    };
    body?: string;
    isBase64Encoded?: boolean;
    cookies?: string[];

    constructor() {}

    setBodyToData(data:any): ProxyResultWrapper {
        this.body = JSON.stringify(data);
        return this;
    }

    setBodyToMessage(msg:string): ProxyResultWrapper {
        this.body = msg;
        return this;
    }

    setCode(status:number): ProxyResultWrapper {
        this.statusCode = status;
        return this;
    }

    setHeader(header:string,value:boolean | number | string): ProxyResultWrapper {
        if (!this.headers) this.headers = {};
        this.headers[header] = value;
        return this;
    }
}