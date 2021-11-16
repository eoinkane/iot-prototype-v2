import express from 'express';
import { routes } from '../../src/index';
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/p', (req, res) => {
  console.log(req);
  console.log(req.body);

  res.send('Hello World!');
});

routes.forEach((route) => {
  const expressMethod = route.method.toLowerCase();
  app[expressMethod](
    route.path.replace('}', '').replace('{', ':'),
    async (req, res) => {
      const rgx = /\/:/;
      const expressPath = route.path.replace('}', '').replace('{', ':');
      const event = { body: req.body };

      if (expressPath.search(rgx) != -1) {
        const paths = {};
        paths[
          expressPath.slice(expressPath.search(rgx) + 2).split('/')[0]
        ] =
          req.params[
            expressPath.slice(expressPath.search(rgx) + 2).split('/')[0]
          ];
        
          event['paths'] = paths;
      };

      console.log(req.params);

      console.log(event);
      const call = await route.action(event, null);
      res.send(call);
    }
  );
});

app.listen(port, () => {
  console.log(`IoT app listening at http://localhost:${port}`);
});
