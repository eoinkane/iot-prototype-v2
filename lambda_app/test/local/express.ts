import express from 'express';
import { routes } from '../../src/index';
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/p', (req, res) => {
    console.log(req);
    console.log(req.body)
    res.send('Hello World!')
});

routes.forEach((route) => {
    const expressMethod = route.method.toLowerCase();
    app[expressMethod](route.path, async (req, res) => {
        const call = await route.action({ body: req.body }, null)
        res.send(call);
    });
});


app.listen(port, () => {
  console.log(`IoT app listening at http://localhost:${port}`);
});