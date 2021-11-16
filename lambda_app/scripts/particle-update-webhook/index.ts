import axios from 'axios';
import { config } from 'dotenv';

(async () => {
  config();

  const evString = process.argv.slice(2).join('');
  const ev2 = JSON.parse(evString);
  Object.keys(ev2).forEach(async (key) => {
    if (key.includes('ProtoV2APIEndpoint')) {
      console.log('updating webhook endpoint');
      console.log(`new endpoint: ${ev2[key]}card/tap`);

      const res1 = await axios.get(`https://api.particle.io/v1/integrations?access_token=${process.env.PARTICLE_TOKEN}`);

      const integration = res1.data.find(x => x.event === process.env.PARTICLE_INTEGRATION_EVENT_NAME);

      const res2 = await axios({
        url: `https://api.particle.io/v1/integrations/${integration.id}?access_token=${process.env.PARTICLE_TOKEN}`,
        method: 'PUT',
        data: {
          event: process.env.PARTICLE_INTEGRATION_EVENT_NAME,
          json: true,
          url: `${ev2[key]}card/tap`
        },
      });

      console.log(`status code: ${res2.status}`);
      console.log(`response body: ${JSON.stringify(res2.data, null, 2)}`);
    }
  });
})();
