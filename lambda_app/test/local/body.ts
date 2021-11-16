var body = {
  staffId: process.argv[2] ? process.argv[2] : "001",
  cardId: process.argv[3] ? process.argv[3] : "001",
  zone: process.argv[4] ? process.argv[4] : "A1"
};

var ev = {
  name: "iot-prototype-v2-card-tapped",
  data: JSON.stringify(body),
  published_at: new Date().toISOString(),
  coreid: "e00fce681eeea26555f7e1d6"
};

const regexp = new RegExp(/\\/,'g');
var str = JSON.stringify(ev);

console.log(`'${JSON.stringify(ev).replace(regexp, "\\\\\\")}'`);


