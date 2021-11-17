import { connect } from '../database/index';
import { config } from 'dotenv';
import { RowDataPacket } from 'mysql2';

export const getStaff = async (request, context) => {
  config();
  const conn = await connect();

  const staff = await conn.query('SELECT * FROM staff;');

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
