import { TeamInfo, TeamResponse, TeamUsersResponse } from "../@types/TeamInfo.js";
import connection from "../database/config.js";

export default class TeamWork {

    public static async create({name, created_by, image_url}: TeamInfo) {

        try {
            
            const client = await connection.connect();

            const res = await connection.query<Pick<TeamResponse, 'id'>>('INSERT INTO teams (name, created_by, image_url) VALUES ($1, $2, $3) RETURNING id',
                [name, created_by, image_url ? image_url : null]
            );

            client.release();

            const [team] = await Promise.all([
                this.getOne(res.rows[0].id),
                this.joinUser(res.rows[0].id, created_by)
            ])

            return team;
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong while trying to create the team');
        }

    }

    public static async getOne(id: number) {

        try {
            
            const client = await connection.connect();

            const res = await connection.query<TeamResponse>(
                'SELECT * FROM teams WHERE id = $1 AND state = true',
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
                'SELECT * FROM teams WHERE state = true'
            )

            client.release();

            return res.rows;
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong while trying to get teams');
        }

    }

    public static async updateOne(id: number, data: Pick<TeamInfo, 'name' | 'image_url'>): Promise<TeamResponse> {

        const { name, image_url } = data;

        try {
            
            const client = await connection.connect();

            const res = await connection.query(
                'UPDATE teams SET name = $1, image_url = $2 ,updated_at = $3 WHERE id = $4 AND state = true',
                [name, image_url ? image_url : null, new Date(), id]
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
                'UPDATE teams SET state = false WHERE id = $1',
                [id]
            )

            client.release();
            
            return await this.getOne(id);
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong when trying to delete team');
        }

    }

    public static async joinUser(teamId: number, userId: number) {

        try {
            const client = await connection.connect();

            const res = await connection.query(
                'INSERT INTO user_team (team_id, user_id) VALUES ($1, $2) RETURNING id',
                [teamId, userId]
            );

            client.release();

            return res;

        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong when joining user to team');
        }

    }

    public static async removeUser(teamId: number, userId: number) {

        try {
            const client = await connection.connect();

            const res = await connection.query(
                'DELETE FROM user_team WHERE team_id = $1 AND user_id = $2',
                [teamId, userId]
            );

            client.release();

            return res;

        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong when removing user to team');
        }

    }

    public static async getTeamUsers(teamId: number) {

        try {

            const client = await connection.connect();

            const res = await connection.query<TeamUsersResponse>(
                `SELECT 
                    a.id,
                    a.name,
                    a."state",
                    a.created_at,
                    a.updated_at,
                    json_build_object(
                        'id', b.id,
                        'name', b.name,
                        'gmail', b.gmail,
                        'state', b."state",
                        'created_at', b.created_at,
                        'updated_at', b.updated_at
                    ) as created_by,
                    json_agg(json_build_object(
                        'id', d.id,
                        'name', d.name,
                        'gmail', d.gmail,
                        'state', d."state",
                        'created_at', d.created_at,
                        'updated_at', d.updated_at
                    )) as users
                FROM teams a 
                INNER JOIN users b ON a.created_by = b.id
                INNER JOIN user_team c ON c.team_id = a.id
                INNER JOIN users d ON c.user_id = d.id
                WHERE a.id = $1 AND a.state = true
                GROUP BY a.id, b.id`,
                [teamId]
            );

            client.release();

            return res.rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong');
        }

    }
}