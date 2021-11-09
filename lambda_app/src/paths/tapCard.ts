import { connect } from '../database/index';
import { config } from 'dotenv';
import { stringBoolean, toDBDateTimeString } from '../utils/index';


export const tapCard = async (request, context) => {
    console.log("tap card function called");
    console.log("loading env values");
    config();
    const {staffId, cardId, zone, dateTappedIsoString} = request.body;
    console.log("card tap props", {staffId, cardId, zone, dateTappedIsoString});
    console.log("connecting to the database");
    const con = await connect();

    console.log(`card ${cardId} tapped at `)
    console.log(new Date(dateTappedIsoString));
    const dbTimeString = toDBDateTimeString(dateTappedIsoString);

    const accessGrantedPermission = await con.query(
        "SELECT `staff`.`staff_id`, `staff`.`access_permission`, IF(`staff`.`access_permission` >= ?, 'true', 'false') AS `access_granted` FROM `staff` WHERE `staff`.`staff_id` = ?;",
        [zone, staffId]
    );

    accessGrantedPermission[0][0]['access_granted'] = stringBoolean(accessGrantedPermission[0][0]['access_granted']);

    const success = accessGrantedPermission[0][0]['access_granted'] ? 1 : 0;

    const insertTapResult = await con.query(
        "INSERT INTO `taps` (`tap_id`, `card_id`, `zone`, `success`, `datetime`) VALUES (NULL, ?, ?, ?, ?);",
        [cardId, zone, success, dbTimeString]
    );

    con.end();

    const body = { 
        accessGranted: accessGrantedPermission[0][0]['access_granted'],
        tapSuccess: insertTapResult[0].hasOwnProperty('affectedRows') && insertTapResult[0].affectedRows === 1
    };

    return body;
}