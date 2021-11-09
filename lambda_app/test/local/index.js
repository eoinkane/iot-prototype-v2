import { handler } from "../../src/app.js";
import event from "./data.js";
(async () => {
    console.log(await handler(event));
})()
