"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = __importDefault(require("../database/config.js"));
class Task {
    static async create({ title, description, created_by }) {
        try {
            const res = await config_js_1.default.connection.query(`INSERT INTO tasks (title, description, created_by) VALUES (?, ?, ?)`, [title, description, created_by]);
            //return await this.getOne(rows.insertId);
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
    static async getOne(id) {
        try {
            const res = await config_js_1.default.connection.query('SELECT * FROM tasks WHERE id = ?', [id]);
            return res;
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
    static async getAll() {
        try {
            const res = await config_js_1.default.connection.query('SELECT * FROM tasks');
            return res;
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
    static async deleteOne(id) {
        try {
            const res = await config_js_1.default.connection.query('UPDATE tasks SET state = false WHERE id = ?', [id]);
            return await this.getOne(id);
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
    static async updateOne(id, data) {
        const task = await this.getOne(id);
        try {
            /* const res = await DBConnection.connection.query(
                'UPDATE tasks SET title = ?, description = ?, updated_at = ? WHERE id = ?',
                [
                    data.title ?? task.title,
                    data.description ?? task.description,
                    new Date(),
                    id
                ]
            ); */
            return await this.getOne(id);
        }
        catch (error) {
            throw new Error('Something went wrong');
        }
    }
    static async assignUser(taskId, userId) {
        try {
            const res = await config_js_1.default.connection.query('INSERT INTO task_user (task_id, user_id) VALUES (?, ?)', [taskId, userId]);
            return res;
        }
        catch (error) {
            console.log(error);
        }
    }
    static async getTaskUsers(taskId) {
        try {
            const res = await config_js_1.default.connection.query(`SELECT a.id, a.title, a.description, a.state, a.created_at, a.updated_at, a.completed_at, json_object('id', b.id, 'name', b.name, 'gmail', b.gmail, 'state', b.state, 'created_at', b.created_at, 'updated_at', b.updated_at) as created_by, json_array(group_concat(concat('"',json_object('name', d.name), '"'))) as users FROM tasks a INNER JOIN users b ON a.created_by = b.id INNER JOIN task_user c on a.id = c.task_id INNER JOIN users d ON c.user_id = d.id WHERE a.id = ?`, [taskId]);
            return res;
        }
        catch (error) {
            console.log(error);
            throw new Error('Something went wrong');
        }
    }
}
exports.default = Task;
