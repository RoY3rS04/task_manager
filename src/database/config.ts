import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class DBConnection {
    static connection: mysql.Connection;

    static async init() {

        if (this.connection) {
            return this.connection;
        }

        this.connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD
        });

        return this.connection;
    }
}

DBConnection.init();

export default DBConnection;