import * as mysql from "mysql2/promise";

export type Rows = mysql.RowDataPacket[];

export const DB: mysql.Pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    namedPlaceholders: true,
});