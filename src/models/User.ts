import bcrypt from 'bcrypt';
import connection from '../database/config.js';
import { Password, UserInfo, UserResponse } from '../@types/UserInfo.js';

export default class User {

    private static async getPassword(userId: number) {
        try {
            const res = await connection.query('SELECT password FROM users WHERE id = ?', [userId]);
            
            return res;
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async create({ name, gmail, password }: UserInfo) {
        
        const hashed_pass = await bcrypt.hash(password, 10);

        try {
            const res  = await connection.query(
                `INSERT INTO users (name, gmail, password) VALUES ($1, $2, $3)`,
                [name, gmail, hashed_pass]
            );

            //return this.getOne(rows.insertId);
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async getOne(id: number) {

        try {
            const res = await connection.query('SELECT id, name, gmail, state, created_at, updated_at FROM users WHERE id = $1',
                [id]);
            
            return res;
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async getAll() {

        try {
            connection.connect();

            const res = await connection.query('SELECT id, name, gmail, state, created_at, updated_at FROM users');
            
            connection.end();

            return res;
        } catch (error) {
            console.log(error);
        }
    }

    public static async deleteOne(id: number) {

        try {
            const res = await connection.query('UPDATE users SET state = false WHERE id = ?', [id]);

            return await this.getOne(id);
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async updateOne(id: number, data: Partial<UserInfo>) {

        try {

            /* const [user, {password}] = await Promise.all([
                this.getOne(id),
                this.getPassword(id)
            ]); */
            

            /* const res = await connection.query('UPDATE users SET name = ?, gmail = ?, password = ? WHERE id = ?', [
                data.name ?? user.name,
                data.gmail ?? user.gmail,
                data.password ? await bcrypt.hash(data.password, 10) : password,
                id
            ]); */

            return await this.getOne(id);
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }
}