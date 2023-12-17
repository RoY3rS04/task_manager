import bcrypt from 'bcrypt';
import DBConnection from '../database/config.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Password, UserInfo, UserResponse } from '../@types/UserInfo.js';

export default class User {

    private static async getPassword(userId: number) {
        try {
            const [rows, fields] = await DBConnection.connection.execute<RowDataPacket[]>('SELECT password FROM users WHERE id = ?', [userId]);
            
            return <Password>rows[0];
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async create({ name, gmail, task_id, password }: UserInfo) {
        
        const hashed_pass = await bcrypt.hash(password, 10);

        try {
            const [rows, fields]  = await DBConnection.connection.execute<ResultSetHeader>(
                `INSERT INTO users (name, gmail, password, task_id) VALUES (?, ?, ?, ?)`,
                [name, gmail, hashed_pass, task_id]
            );

            return this.getOne(rows.insertId);
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async getOne(id: number): Promise<UserResponse> {

        try {
            const [rows, fields] = await DBConnection.connection.execute<RowDataPacket[]>('SELECT id, name, gmail, state, task_id, created_at, updated_at FROM users WHERE id = ?',
                [id]);
            
            return <UserResponse>rows[0];
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async getAll(): Promise<UserResponse[]> {

        try {
            const [rows, fields] = await DBConnection.connection.execute('SELECT id, name, gmail, state, task_id, created_at, updated_at FROM users');
            
            return <UserResponse[]>rows;
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async deleteOne(id: number): Promise<UserResponse> {

        try {
            const [rows, fields] = await DBConnection.connection.execute('UPDATE users SET state = false WHERE id = ?', [id]);

            return await this.getOne(id);
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async updateOne(id: number, data: Partial<UserInfo>): Promise<UserResponse> {

        try {

            const [user, {password}] = await Promise.all([
                this.getOne(id),
                this.getPassword(id)
            ]);
            

            const [rows, fields] = await DBConnection.connection.execute('UPDATE users SET name = ?, gmail = ?, password = ? WHERE id = ?', [
                data.name ?? user.name,
                data.gmail ?? user.gmail,
                data.password ? await bcrypt.hash(data.password, 10) : password,
                id
            ]);

            return await this.getOne(id);
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
}