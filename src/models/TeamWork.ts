import { TeamInfo, TeamResponse } from "../@types/TeamInfo.js";
import connection from "../database/config.js";

export default class TeamWork {

    public static async create({name, created_by}: TeamInfo) {

        try {
            
            const client = await connection.connect();

            const res = await connection.query<Pick<TeamResponse, 'id'>>('INSERT INTO team_works (name, created_by) VALUES ($1, $2) RETURNING id',
                [name, created_by]
            );

            client.release();

            return await this.getOne(res.rows[0].id);
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong while trying to create the team');
        }

    }

    public static async getOne(id: number) {

        try {
            
            const client = await connection.connect();

            const res = await connection.query<TeamResponse>(
                'SELECT * FROM team_works WHERE id = $1',
                [id]
            )

            client.release();

            return res.rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong while trying to get team');
        }

    }

    public static async getAll(): Promise<TeamResponse[]> {

        try {
            
            const client = await connection.connect();

            const res = await connection.query<TeamResponse>(
                'SELECT * FROM team_works'
            )

            client.release();

            return res.rows;
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong while trying to get teams');
        }

    }

    public static async updateOne(id: number, name: string): Promise<TeamResponse> {

        try {
            
            const client = await connection.connect();

            const res = await connection.query(
                'UPDATE team_works SET name = $1, updated_at = $2 WHERE id = $3',
                [name, new Date(), id]
            );

            client.release();

            return await this.getOne(id);
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong when trying to update the team');
        }

    }

    public static async deleteOne(id: number): Promise<TeamResponse> {

        try {

            const client = await connection.connect();

            const res = await connection.query(
                'UPDATE team_works SET state = false WHERE id = $1',
                [id]
            )

            client.release();
            
            return await this.getOne(id);
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong when trying to delete team');
        }

    }
}