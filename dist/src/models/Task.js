"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = __importDefault(require("../database/config.js"));
class Task {
    static async create({ title, description }) {
        try {
            const [rows, fields] = await config_js_1.default.connection.execute(`INSERT INTO tasks (title, description) VALUES (?, ?)`, [title, description]);
            return await this.getOne(rows.insertId);
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
    static async getOne(id) {
        try {
            const [rows, fields] = await config_js_1.default.connection.execute('SELECT * FROM tasks WHERE id = ?', [id]);
            return rows[0];
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
    static async getAll() {
        try {
            const [rows, fields] = await config_js_1.default.connection.execute('SELECT * FROM tasks');
            return rows;
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
    static async deleteOne(id) {
        try {
            const [rows, fields] = await config_js_1.default.connection.execute('UPDATE tasks SET state = false WHERE id = ?', [id]);
            return await this.getOne(id);
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
    static async updateOne(id, data) {
        const task = await this.getOne(id);
        try {
            const [rows, fields] = await config_js_1.default.connection.execute('UPDATE tasks SET title = ?, description = ?, updated_at = ? WHERE id = ?', [
                data.title ?? task.title,
                data.description ?? task.description,
                new Date(),
                id
            ]);
            return await this.getOne(id);
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
}
exports.default = Task;
