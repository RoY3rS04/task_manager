import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class DBConnection {
    static connection: Client;

    static async init() {

        if (this.connection) {
            return this.connection;
        }

        try {
            this.connection = new Client({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: Number(process.env.DB_PORT)
            });

            return this.connection;
        } catch (error) {
            console.log(error);
        }
    }
}

DBConnection.init();

export default DBConnection.connection;