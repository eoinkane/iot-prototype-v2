import { connect } from '../database/index';
import { config } from 'dotenv';
import { stringBoolean, toDBDateTimeString } from '../utils/index';
import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
var Particle = require('particle-api-js');

const particle = new Particle();

export const tapCard = async (request, context) => {
  console.log('tap card function called');
  console.log('loading env values');
  config();
  const { staffId, cardId, zone } = JSON.parse(request.body.data);
  const dateTappedIsoString = request.body['published_at'];
  console.log('card tap props', { staffId, cardId, zone, dateTappedIsoString });
  console.log('connecting to the database');
  const con = await connect();

  console.log(`card ${cardId} tapped at `);
  console.log(new Date(dateTappedIsoString));
  const dbTimeString = toDBDateTimeString(dateTappedIsoString);

  const accessGrantedPermission = await con.query(
    "SELECT `staff`.`staff_id`, `staff`.`access_permission`, IF(`staff`.`access_permission` >= ?, 'true', 'false') AS `access_granted` FROM `staff` WHERE `staff`.`staff_id` = ?;",
    [zone, staffId]
  );

  accessGrantedPermission[0][0]['access_granted'] = stringBoolean(
    accessGrantedPermission[0][0]['access_granted']
  );

  const success = accessGrantedPermission[0][0]['access_granted'] ? 1 : 0;

  const insertTapResult = await con.query(
    'INSERT INTO `taps` (`tap_id`, `card_id`, `zone`, `success`, `datetime`) VALUES (NULL, ?, ?, ?, ?);',
    [cardId, zone, success, dbTimeString]
  );

  con.end();

  const body = {
    accessGranted: accessGrantedPermission[0][0]['access_granted'],
    tapSuccess:
      insertTapResult[0].hasOwnProperty('affectedRows') &&
      (insertTapResult[0] as ResultSetHeader).affectedRows === 1,
  };

  console.log('calling particle funcition');
  console.log(
    `will call the ${
      body.accessGranted ? 'flashGreenLed' : 'flashRedLed'
    } function`
  );
  const result = await particle.callFunction({
    deviceId: process.env.PARTICLE_DEVICE_ID,
    name: body.accessGranted ? 'flashGreenLed' : 'flashRedLed',
    argument: 'command',
    auth: process.env.PARTICLE_TOKEN,
  });
  console.log(result);

  return body;
};
