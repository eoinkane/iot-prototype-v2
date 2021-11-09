import { createConnection } from 'mysql2/promise';
import { toDatetimeISOString } from './utils/index.js'

const connect = async () => await createConnection({
    host: 'localhost',
    port: '6033',
    user: 'root',
    password: 'my_secret_password',
    database: 'app_db',
    typeCast: (field, next) => {
        if (field.type === 'DATETIME') {
            return toDatetimeISOString(field.string());
        } else {
            return next();
        }
    }
});

const stringBoolean = (string) => {
    if (string === 'true') return true;
    if (string === 'false') return false;
}

const cardIdOnSite = async (cardId) => {
    const con = await connect();

    const result = await con.query(
        "SELECT `card_id`, IF((MOD(COUNT(`tap_id`), 2)) = 1, 'true', 'false') AS `on_site` FROM taps WHERE card_id = ?;",
        [cardId]
    );

    con.end();

    return stringBoolean(result[0][0]['on_site']);
};

(async () => {
    const card1Present = await cardIdOnSite("001");
    console.log(`Card 001 is ${card1Present ? "on site" : "not on site"}`);
})()