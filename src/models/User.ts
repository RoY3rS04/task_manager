import bcrypt from 'bcrypt';
import connection from '../database/config.js';
import { Password, UserInfo, UserResponse } from '../@types/UserInfo.js';
import { TeamResponse } from '../@types/TeamInfo.js';
import TeamWork from './TeamWork.js';

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

    public static async create({ name, email, password, image_url }: UserInfo) {

        try {
            const [hashed_pass, client] = await Promise.all(
                [
                    bcrypt.hash(password.trim(), 10),
                    connection.connect()
                ]
            );

            const res  = await connection.query<Pick<UserResponse, 'id'>>(
                `INSERT INTO users (name, gmail, password, image_url) VALUES ($1, $2, $3, $4) RETURNING id`,
                [name, email, hashed_pass, image_url ? image_url : null]
            );

            client.release();

            return await this.getOne(res.rows[0].id, true);
        } catch (error) {
            throw new Error('Something went wrong when trying to save the user');
        }
    }

    public static async getOne(idOrGmail: number|string, allowFalseState: boolean = false): Promise<UserResponse | undefined> {

        try {

            const client = await connection.connect();

            let searchingBy: string;

            if (typeof idOrGmail === 'number') {
                searchingBy = 'id';
            } else {
                searchingBy = 'gmail';
            }

            const res = await connection.query<UserResponse>(`SELECT id, name, gmail, state, image_url, created_at, updated_at FROM users WHERE ${searchingBy} = $1 AND state = true ${allowFalseState ? 'OR state = false' : ''}`,
                [idOrGmail]);
            
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
            
            await this.setState(id, false);

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

            if (!user) return

            const res = await connection.query('UPDATE users SET name = $1, image_url = $2, password = $3 WHERE id = $4 AND state = true', [
                data.name ?? user.name,
                data.image_url ?? user.image_url,
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

    public static async verifyPassword(userId: number, password: string) {
    
        return await bcrypt.compare(password, (await this.getPassword(userId)).password);

    }

    public static async setState(id: number, state: boolean) {
        
        try {
            
            const client = await connection.connect();

            const res = await connection.query(`UPDATE users SET state = $1 WHERE id = $2`, [state,id]);

            client.release();

        } catch (error) {
            throw new Error("Something went wrong when setting state");
        }

    }

    public static async getUserTeam(userId: number, populate: boolean = false) {

        try {
            
            const client = await connection.connect();

            const res = await connection.query <Pick<TeamResponse, 'id'>>(
                'SELECT a.id FROM teams a INNER JOIN user_team b ON a.id = b.team_id WHERE b.user_id = $1 AND a.state = true',
                [userId]
            );

            client.release();

            if (populate) {
                return TeamWork.getTeamUsers(res.rows[0].id, true);
            }

            return TeamWork.getTeamUsers(res.rows[0].id);
        } catch (error) {
            throw new Error("Something went wrong when trying to get team");
        }

    }
}