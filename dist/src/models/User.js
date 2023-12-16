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
            const [rows, fields] = await config_js_1.default.connection.execute('SELECT password FROM users WHERE id = ?', [userId]);
            return rows[0];
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
    static async create(name, gmail, password, task_id = null, updated_at = null) {
        const state = true;
        const created_at = new Date();
        const hashed_pass = await bcrypt_1.default.hash(password, 10);
        try {
            const [rows, fields] = await config_js_1.default.connection.execute(`INSERT INTO users (name, gmail, password, task_id, state, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [name, gmail, hashed_pass, task_id, state, created_at, updated_at]);
            return this.getOne(rows.insertId);
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
    static async getOne(id) {
        try {
            const [rows, fields] = await config_js_1.default.connection.execute('SELECT id, name, gmail, state, task_id, created_at, updated_at FROM users WHERE id = ?', [id]);
            return rows[0];
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
    static async getAll() {
        try {
            const [rows, fields] = await config_js_1.default.connection.execute('SELECT id, name, gmail, state, task_id, created_at, updated_at FROM users');
            return rows;
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
    static async deleteOne(id) {
        try {
            const [rows, fields] = await config_js_1.default.connection.execute('UPDATE users SET state = false WHERE id = ?', [id]);
            return await this.getOne(id);
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
    static async updateOne(id, data) {
        try {
            const [user, { password }] = await Promise.all([
                this.getOne(id),
                this.getPassword(id)
            ]);
            const [rows, fields] = await config_js_1.default.connection.execute('UPDATE users SET name = ?, gmail = ?, password = ? WHERE id = ?', [
                data.name ?? user.name,
                data.gmail ?? user.gmail,
                data.password ? await bcrypt_1.default.hash(data.password, 10) : password,
                id
            ]);
            return await this.getOne(id);
        }
        catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
}
exports.default = User;
