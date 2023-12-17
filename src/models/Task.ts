import { TaskInfo, TaskResponse } from "../@types/TaskInfo.js";
import connection from "../database/config.js";

export default class Task {

    public static async create({title, description, created_by}: TaskInfo) {

        try {
            
            const res = await connection.query(
                `INSERT INTO tasks (title, description, created_by) VALUES (?, ?, ?)`,
                [title, description, created_by]
            );

            //return await this.getOne(rows.insertId);
        } catch (error) {
            throw new Error('Something went wrong');
        }
        
    }

    public static async getOne(id: number) {

        try {
            const res = await connection.query(
                'SELECT * FROM tasks WHERE id = ?',
                [id]
            );

            return res
        } catch (error) {
            throw new Error('Something went wrong');
        }
        
    }

    public static async getAll() {

        try {
            const res = await connection.query(
                'SELECT * FROM tasks'
            );

            return res
        } catch (error) {
            throw new Error('Something went wrong');
        }

    }

    public static async deleteOne(id: number) {

        try {
            const res = await connection.query(
                'UPDATE tasks SET state = false WHERE id = ?',
                [id]
            );

            return await this.getOne(id);
        } catch (error) {
            throw new Error('Something went wrong');
        }
        
    }

    public static async updateOne(id: number, data: Partial<TaskInfo>) {

        const task = await this.getOne(id);

        try {
            /* const res = await connection.query(
                'UPDATE tasks SET title = ?, description = ?, updated_at = ? WHERE id = ?',
                [
                    data.title ?? task.title,
                    data.description ?? task.description,
                    new Date(),
                    id
                ]
            ); */

            return await this.getOne(id);
        } catch (error) {
            throw new Error('Something went wrong');
        }        
        
    }

    public static async assignUser(taskId: number, userId: number) {

        try {
            const res = await connection.query(
                'INSERT INTO task_user (task_id, user_id) VALUES (?, ?)',
                [taskId, userId]
            )

            return res;
        } catch (error) {
            console.log(error);
        }

    }

    public static async getTaskUsers(taskId: number) {

        try {
            const res = await connection.query(
                `SELECT a.id, a.title, a.description, a.state, a.created_at, a.updated_at, a.completed_at, json_object('id', b.id, 'name', b.name, 'gmail', b.gmail, 'state', b.state, 'created_at', b.created_at, 'updated_at', b.updated_at) as created_by, json_array(group_concat(concat('"',json_object('name', d.name), '"'))) as users FROM tasks a INNER JOIN users b ON a.created_by = b.id INNER JOIN task_user c on a.id = c.task_id INNER JOIN users d ON c.user_id = d.id WHERE a.id = ?`,
                [taskId]
            );

            return res;
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong');
        }

    }
}