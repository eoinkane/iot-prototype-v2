import { connect } from '../database/index';
import { config } from 'dotenv';
import { RowDataPacket } from 'mysql2';

export const getStaffOnSite = async (request, context) => {
  config();
  const conn = await connect();

  const staff = await conn.query(
    'SELECT `staff`.* FROM (SELECT `card_id` FROM `taps` GROUP BY `card_id` HAVING COUNT(`card_id`) % 2 != 0) ' +
    'AS `on_site_taps` JOIN `staff` ON `on_site_taps`.`card_id` = `staff`.`current_card_id`;'
  );

  const body = (staff[0] as RowDataPacket[]).map((cur) => {
    let staffId = cur['staff_id'];
    while (staffId.toString().length !== 3) {
        staffId = '0' + staffId.toString();
    }

    const firstName = cur['first_name'];
    const lastName = cur['last_name'];
    const accessPermission = cur['access_permission'];
    let currentCardId = cur['current_card_id'];
    while (currentCardId.toString().length !== 3) {
        currentCardId = '0' + currentCardId.toString();
    }

    return {
      staffId,
      firstName,
      lastName,
      role: cur['role'],
      accessPermission,
      currentCardId,
    };
  });

  conn.end();
  return body;
};
