import { TaskResponse } from '../@types/TaskInfo';
import { TeamResponse } from '../@types/TeamInfo';
import { UserResponse } from '../@types/UserInfo';
import connection from '../database/config'

export default async function validateRecord(tableName: string, id: string | number) {
        
    const client = await connection.connect();

    const res = await connection.query<TaskResponse|UserResponse|TeamResponse>(
        `SELECT * FROM ${tableName} WHERE id = ${id}`
    );

    client.release();

    if (!res.rows[0]) {
        throw Error('The record does\'nt exists');
    }

    if (!res.rows[0].state) {
        throw Error('The record was deleted');
    }
}