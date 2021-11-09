import { connect } from '../database/index';
import { config } from 'dotenv';

export const teardown = async (request, context) => {
    console.log("GET /teardown called. deleting data from the database");
    
    config();

    const con = await connect();

    await con.query("DROP TABLE taps;");
    console.log("taps table dropped");
    await con.query("DROP TABLE staff;");
    console.log("staff table dropped");
    await con.query("DROP TABLE cards;");
    console.log("cards table dropped");
    await con.query("DROP TABLE access;");
    console.log("access table dropped");

    con.end()
    return { success: true };
}