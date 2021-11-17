import { connect } from '../database/index';
import { config } from 'dotenv';
import { RowDataPacket } from 'mysql2';

export const getStaff = async (request, context) => {
  config();
  const conn = await connect();

  const staff = await conn.query('SELECT * FROM staff;');

  const body = (staff[0] as RowDataPacket[]).map((cur) => {
    const staffId = cur['staff_id'];
    const firstName = cur['first_name'];
    const lastName = cur['last_name'];
    const accessPermission = cur['access_permission'];
    const currentCardId = cur['current_card_id'];
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
