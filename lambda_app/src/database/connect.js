import { createConnection } from 'mysql2/promise';
import { toDatetimeISOString } from '../utils/index.js'

export const connect = async () => await createConnection({
    host: String(process.env.DB_HOST),
    port: String(process.env.DB_PORT),
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE),
    typeCast: (field, next) => {
        if (field.type === 'DATETIME') {
            return toDatetimeISOString(field.string());
        } else {
            return next();
        }
    }
});