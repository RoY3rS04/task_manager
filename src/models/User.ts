import bcrypt from 'bcrypt';
import connection from '../database/config.js';
import { Password, UserInfo, UserResponse } from '../@types/UserInfo.js';

export default class User {

    private static async getPassword(userId: number) {
        try {

            const client = await connection.connect();

            const res = await connection.query<Password>('SELECT password FROM users WHERE id = $1', [userId]);
            
            client.release();

            return res.rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong when trying to get the password');
        }
    }

    public static async create({ name, gmail, password }: UserInfo) {

        try {
            const [hashed_pass, client] = await Promise.all(
                [
                    bcrypt.hash(password.trim(), 10),
                    connection.connect()
                ]
            );

            const res  = await connection.query<Pick<UserResponse, 'id'>>(
                `INSERT INTO users (name, gmail, password) VALUES ($1, $2, $3) RETURNING id`,
                [name, gmail, hashed_pass]
            );

            client.release();

            return await this.getOne(res.rows[0].id);
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async getOne(id: number, allowDeleted: boolean = false) {

        try {

            const client = await connection.connect();

            const res = await connection.query<UserResponse>('SELECT id, name, gmail, state, created_at, updated_at FROM users WHERE id = $1 AND state = $2',
                [id, !allowDeleted]);
            
            client.release();
            
            return res.rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong when trying to get the user');
        }
    }

    public static async getAll() {

        try {
            const client = await connection.connect();

            const res = await connection.query<UserResponse>('SELECT id, name, gmail, state, created_at, updated_at FROM users WHERE state = true');
            
            client.release();

            return res.rows;
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong');
        }
    }

    public static async deleteOne(id: number) {

        try {
            const client = await connection.connect();

            const res = await connection.query('UPDATE users SET state = false WHERE id = $1', [id]);

            client.release();

            return await this.getOne(id, true);
        } catch (error) {
            throw new Error('Something went wrong when trying to remove the user');
        }
    }

    public static async updateOne(id: number, data: Partial<UserInfo>) {

        try {

            const [user, {password}, client] = await Promise.all([
                this.getOne(id),
                this.getPassword(id),
                connection.connect()
            ]);

            const res = await connection.query('UPDATE users SET name = $1, gmail = $2, password = $3 WHERE id = $4 AND state = true', [
                data.name ?? user.name,
                data.gmail ?? user.gmail,
                data.password?.trim() ? await bcrypt.hash(data.password.trim(), 10) : password,
                id
            ]);

            client.release();

            return await this.getOne(id);
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong when trying to update the user');
        }
    }
}