import { TaskInfo, TaskResponse, TaskUsersResponse } from "../@types/TaskInfo.js";
import connection from "../database/config.js";

export default class Task {

    public static async create({title, description, created_by}: TaskInfo) {

        try {
            
            const client = await connection.connect();

            const res = await connection.query<Pick<TaskResponse, 'id'>>(
                `INSERT INTO tasks (title, description, created_by) VALUES ($1, $2, $3) RETURNING id`,
                [title, description, created_by]
            );

            client.release();

            return await this.getOne(res.rows[0].id);
        } catch (error) {
            throw new Error('Something went wrong');
        }
        
    }

    public static async getOne(id: number, allowDeleted: boolean = false): Promise<TaskResponse | undefined> {

        try {

            const client = await connection.connect();

            const res = await connection.query<TaskResponse>(
                'SELECT * FROM tasks WHERE id = $1 AND state = $2',
                [id, !allowDeleted]
            );

            client.release();

            return res.rows[0]
        } catch (error) {
            throw new Error('Something went wrong');
        }
        
    }

    public static async getAll(userId: number, populate: boolean = false) {

        try {

            const client = await connection.connect();

            const res = await connection.query<TaskResponse>(
                `
                    SELECT * FROM tasks WHERE state = true AND created_by = $1
                    UNION
                    SELECT a.* FROM tasks a
                    INNER JOIN user_task b ON b.task_id = a.id
                    WHERE b.user_id = $1 AND a."state" = true
                `,
                [userId]
            );

            if (!populate) {
                return res.rows;
            }

            client.release();

            /* let tasks: TaskUsersResponse[] = [];

            //todo: Change this because it could take many resources
            for (let task of res.rows) {
                tasks.push((await this.getTasksUsers(task.id))[0])
            } */
            const taskIds = res.rows.map(task => task.id);

            return await this.getTasksUsers(taskIds);
        } catch (error) {
            throw new Error('Something went wrong');
        }

    }

    public static async deleteOne(id: number) {

        try {

            const client = await connection.connect();

            const res = await connection.query(
                'UPDATE tasks SET state = false WHERE id = $1',
                [id]
            );

            client.release();

            return await this.getOne(id, true);
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong');
        }
        
    }

    public static async updateOne(id: number, data: Partial<TaskInfo>) {

        const task = <TaskResponse>await this.getOne(id);

        try {

            const client = await connection.connect();

            const res = await connection.query(
                'UPDATE tasks SET title = $1, description = $2, updated_at = $3 WHERE id = $4 AND state = true',
                [
                    data.title ?? task.title,
                    data.description ?? task.description,
                    new Date(),
                    id
                ]
            ); 

            client.release();

            return await this.getOne(id);
        } catch (error) {
            throw new Error('Something went wrong');
        }        
        
    }

    public static async assignUser(taskId: number, userId: number) {

        try {

            const client = await connection.connect();

            const res = await connection.query(
                'INSERT INTO user_task (task_id, user_id) VALUES ($1, $2)',
                [taskId, userId]
            )

            client.release();

            return res;
        } catch (error) {
            console.log(error);
            throw new Error('Could\'nt assign user to task');
        }

    }

    public static async removeUser(taskId: number, userId: number) {

        try {

            const client = await connection.connect();

            const res = await connection.query(
                'DELETE FROM user_task WHERE task_id = $1 AND user_id = $2',
                [taskId, userId]
            )

            client.release();

            return res;
        } catch (error) {
            console.log(error);
            throw new Error('Could\'nt remove user from task');
        }

    }

    public static async getTasksUsers(taskIdOrIds: number|number[]) {

        try {

            const client = await connection.connect();

            const res = await connection.query<TaskUsersResponse>(
                `SELECT
                    a.id,
                    a.title,
                    a.description,
                    a."state",
                    a.created_at,
                    a.updated_at,
                    a.completed_at,
                    json_build_object(
                        'id',
                        b.id,
                        'name',
                        b.name,
                        'gmail',
                        b.gmail,
                        'state',
                        b."state",
                        'image_url',
                        b."image_url",
                        'created_at',
                        b.created_at,
                        'updated_at',
                        b.updated_at
                    ) as created_by,
                    COALESCE(json_agg(
                        json_build_object(
                            'id',
                            d.id,
                            'name',
                            d.name,
                            'gmail',
                            d.gmail,
                            'state',
                            d."state",
                            'image_url',
                            d."image_url",
                            'created_at',
                            d.created_at,
                            'updated_at',
                            d.updated_at
                        )
                    ) FILTER(WHERE d.id IS NOT NULL),
                    '[]'::JSON
                    ) as users
                FROM
                    tasks a
                    INNER JOIN users b ON a.created_by = b.id
                    FULL OUTER JOIN user_task c ON c.task_id = a.id
                    FULL OUTER JOIN users d ON c.user_id = d.id
                WHERE
                    a.id in (${taskIdOrIds})
                    AND a.state = true
                GROUP BY
                    a.id, b.id`
            );

            client.release();

            return res.rows;
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong');
        }

    }
}