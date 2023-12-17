import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TaskInfo } from "../@types/TaskInfo.js";
import DBConnection from "../database/config.js";

export default class Task {

    public static async create({title, description, created_by}: TaskInfo) {

        try {
            
            const [rows, fields] = await DBConnection.connection.execute<ResultSetHeader>(
                `INSERT INTO tasks (title, description, created_by) VALUES (?, ?, ?)`,
                [title, description, created_by]
            );

            return await this.getOne(rows.insertId);
        } catch (error) {
            throw new Error('Something went wrong');
        }
        
    }

    public static async getOne(id: number): Promise<TaskInfo> {

        try {
            const [rows, fields] = await DBConnection.connection.execute<RowDataPacket[]>(
                'SELECT * FROM tasks WHERE id = ?',
                [id]
            );

            return <TaskInfo>rows[0]
        } catch (error) {
            throw new Error('Something went wrong');
        }
        
    }

    public static async getAll(): Promise<TaskInfo[]> {

        try {
            const [rows, fields] = await DBConnection.connection.execute<RowDataPacket[]>(
                'SELECT * FROM tasks'
            );

            return <TaskInfo[]>rows
        } catch (error) {
            throw new Error('Something went wrong');
        }

    }

    public static async deleteOne(id: number) {

        try {
            const [rows, fields] = await DBConnection.connection.execute(
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
            const [rows, fields] = await DBConnection.connection.execute(
                'UPDATE tasks SET title = ?, description = ?, updated_at = ? WHERE id = ?',
                [
                    data.title ?? task.title,
                    data.description ?? task.description,
                    new Date(),
                    id
                ]
            );

            return await this.getOne(id);
        } catch (error) {
            throw new Error('Something went wrong');
        }        
        
    }

}