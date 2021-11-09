import { connect } from '../database/index.js';
import { stringBoolean } from '../utils/index.js';
import { config } from 'dotenv';

export const getCardOnSiteByCardId = async (request, context) => {
    config();
    const cardId = request.paths.cardId;
    const con = await connect();

    const result = await con.query(
        "SELECT `on_site_t`.`card_id`, `on_site_t`.`on_site`, `zone_t`.`zone` FROM ( SELECT `taps`.`card_id` AS `card_id`, IF( (MOD(COUNT(`taps`.`tap_id`), 2)) = 1, \"true\", \"false\" ) AS `on_site` "
        + "FROM taps WHERE `taps`.`success` = 1 AND `taps`.`card_id` = ? ) `on_site_t` "
        + "JOIN( SELECT `taps`.`tap_id`, `taps`.`card_id`, `taps`.`zone` FROM `taps` WHERE `taps`.`success` = 1 AND `taps`.`card_id` = ? ORDER BY `taps`.`tap_id` DESC LIMIT 1 ) `zone_t`;",
        [cardId, cardId]
    );

    con.end();

    if (result[0].length === 0) {
        return {
            cardOnSite: false,
            cardNotBeenOnSiteYet: true
        }
    }

    const body = { cardOnSite: stringBoolean(result[0][0]['on_site']) };
    if (body.cardOnSite) {
        body['latestZone'] = result[0][0].zone
    }

    return body;
}