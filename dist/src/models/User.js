"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_js_1 = __importDefault(require("../database/config.js"));
class User {
    static async getPassword(userId) {
        try {
            const res = await config_js_1.default.connection.query('SELECT password FROM users WHERE id = ?', [userId]);
            return res;
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
    static async create({ name, gmail, password }) {
        const hashed_pass = await bcrypt_1.default.hash(password, 10);
        try {
            const res = await config_js_1.default.connection.query(`INSERT INTO users (name, gmail, password) VALUES ($1, $2, $3)`, [name, gmail, hashed_pass]);
            //return this.getOne(rows.insertId);
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
    static async getOne(id) {
        try {
            const res = await config_js_1.default.connection.query('SELECT id, name, gmail, state, created_at, updated_at FROM users WHERE id = $1', [id]);
            return res;
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
    static async getAll() {
        const res = await config_js_1.default.connection.query('SELECT id, name, gmail, state, created_at, updated_at FROM users');
        console.log('hi');
        console.log(res);
        return res;
    }
    static async deleteOne(id) {
        try {
            const res = await config_js_1.default.connection.query('UPDATE users SET state = false WHERE id = ?', [id]);
            return await this.getOne(id);
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
    static async updateOne(id, data) {
        try {
            /* const [user, {password}] = await Promise.all([
                this.getOne(id),
                this.getPassword(id)
            ]); */
            /* const res = await DBConnection.connection.query('UPDATE users SET name = ?, gmail = ?, password = ? WHERE id = ?', [
                data.name ?? user.name,
                data.gmail ?? user.gmail,
                data.password ? await bcrypt.hash(data.password, 10) : password,
                id
            ]); */
            return await this.getOne(id);
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
}
exports.default = User;
