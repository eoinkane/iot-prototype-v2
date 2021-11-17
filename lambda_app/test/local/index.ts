import { RouterEvent } from 'aws-lambda-router';
import { handler } from "../../src/index";
import event from "./data";

(async () => {
    event.path = process.argv[2] ? process.argv[2] : "/card/on-site/001";
    event.body = process.argv[3] ? process.argv[3] : "[]";
    event.httpMethod = process.argv[3] ? "POST" : "GET";
    const proxyResult = await handler((event as unknown as RouterEvent), null);
    console.log(proxyResult);
    console.log(JSON.parse(proxyResult.body));
})();
