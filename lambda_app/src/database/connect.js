import { createConnection } from 'mysql2/promise';
import { toDatetimeISOString } from '../utils/index.js'

export const connect = async () => await createConnection({
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