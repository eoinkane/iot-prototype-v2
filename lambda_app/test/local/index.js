import { handler } from "../../src/app.js";
import event from "./data.js";

(async () => {
    event.path = process.argv[2] ? process.argv[2] : "/card/on-site/001";
    event.body = process.argv[3] ? process.argv[3] : "[]";
    const proxyResult = await handler(event);
    console.log(proxyResult);
    console.log(JSON.parse(proxyResult.body));
})()
