import { connect } from './database/index';
import { toDBDateTimeString } from './utils/index'

import { config } from 'dotenv';
config();

const stringBoolean = (string) => {
    if (string === 'true') return true;
    if (string === 'false') return false;
}

const cardIdOnSite = async (cardId) => {
    const con = await connect();

    const result = await con.query(
        "SELECT `on_site_t`.`card_id`, `on_site_t`.`on_site`, `zone_t`.`zone` FROM ( SELECT `taps`.`card_id` AS `card_id`, IF( (MOD(COUNT(`taps`.`tap_id`), 2)) = 1, \"true\", \"false\" ) AS `on_site` "
        + "FROM taps WHERE `taps`.`success` = 1 AND `taps`.`card_id` = ? ) `on_site_t` "
        + "JOIN( SELECT `taps`.`tap_id`, `taps`.`card_id`, `taps`.`zone` FROM `taps` WHERE `taps`.`success` = 1 AND `taps`.`card_id` = ? ORDER BY `taps`.`tap_id` DESC LIMIT 1 ) `zone_t`;",
        [cardId, cardId]
    );

    con.end();

    const body = { cardOnSite: stringBoolean(result[0][0]['on_site']) };
    if (body.cardOnSite) {
        body['latestZone'] = result[0][0].zone
    }

    return body;
};

(async () => {
    const card1Result = await cardIdOnSite("001");
    console.log(card1Result);
})();

const cardTapped = async (staffId, cardId, zone, dateTappedIsoString) => {
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
};

(async () => {
    const result = await cardTapped("001", "001", "A2", "2021-11-09T11:10:07Z");

    console.log(result);
})();