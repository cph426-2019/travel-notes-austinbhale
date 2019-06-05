import * as mysql from "mysql2/promise";

export type Rows = mysql.RowDataPacket[];
// When we insert a new row in the database, we will be able
// to receive the id of the result.
export type InsertResult = mysql.OkPacket;

export const DB: mysql.Pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    namedPlaceholders: true,
});