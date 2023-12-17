"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DBConnection {
    static connection;
    static async init() {
        if (this.connection) {
            return this.connection;
        }
        try {
            this.connection = new pg_1.Client({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: Number(process.env.DB_PORT)
            });
            this.connection.connect();
            return this.connection;
        }
        catch (error) {
            console.log(error);
        }
    }
}
DBConnection.init();
console.log(DBConnection.connection);
exports.default = DBConnection;
