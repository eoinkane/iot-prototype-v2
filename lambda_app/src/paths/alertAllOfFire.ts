import { connect } from '../database/index';
import { config } from 'dotenv';
import { RowDataPacket } from 'mysql2';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export const alertAllOfFire = async (request, context) => {
  console.log('GET /alert/fire/all called');
  config();
  console.log('connecting to the database');
  const conn = await connect();

  console.log('querying the database');
  const staff = await conn.query(
    'SELECT `staff`.`first_name`, `staff`.`phone`, `zone_t`.`latest_zone` ' +
    ' FROM (SELECT `card_id` FROM `taps` WHERE `success` = 1 ' +
    'GROUP BY `card_id` HAVING COUNT(`card_id`) % 2 != 0) AS `on_site_taps` JOIN `staff` ON `on_site_taps`.`card_id` ' + 
    '= `staff`.`current_card_id` JOIN ( SELECT `taps`.`card_id` AS `card_id` , `taps`.`zone` AS `latest_zone` ' +
    'FROM `taps` WHERE `taps`.`success` = 1 ORDER BY `taps`.`tap_id` DESC ) AS `zone_t` ON `zone_t`.`card_id` ' +
    '= `on_site_taps`.`card_id`;'
  );

  const phoneNumbers: [firstName: string, phone: string, latestZone: string][] = (staff[0] as RowDataPacket[]).map((cur) => {
    return [cur['first_name'], cur['phone'], cur['latest_zone']];
  });

  console.log("closing db connection");
  conn.end();

  console.log(`${phoneNumbers.length} is the number of phone numbers to send the message to`);
  console.log('initialising the sns client')
  const snsClient = new SNSClient({ region: process.env.AWS_REGION });
  const sentSnsMessages = [];

  phoneNumbers.forEach((phoneNumber) => {
    console.log('sending the message for');
    console.log(phoneNumber);
    sentSnsMessages.push(snsClient.send(new PublishCommand({
        Message: `Office Alert: Hi ${phoneNumber[0]}, you are currently in zone ${phoneNumber[2]}. The fire alarm has been raised in the building. Please make your way to the exit calmly.`,
        MessageAttributes: {'AWS.SNS.SMS.SenderID': {'DataType': 'String', 'StringValue': 'IoTProtoApp'}},
        PhoneNumber: phoneNumber[1]
    })));
  });

  console.log('awaiting all')
  await Promise.all(sentSnsMessages);

  console.log("All messages sent");
  return {
    success: true
  };
};
