import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class DBConnection {
    static connection: Client;

    static async init() {

        if (this.connection) {
            return this.connection;
        }
        
        this.connection = new Client({
            host: process.env.PG_HOST,
            user: process.env.PG_USER,
            database: process.env.PG_NAME,
            password: process.env.PG_PASSWORD,
            port: Number(process.env.PG_PORT)
        });

        return this.connection;
    }
}

DBConnection.init();

export default DBConnection.connection;