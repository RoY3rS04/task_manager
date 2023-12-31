import { UserResponse } from "./UserInfo"

export interface TaskInfo {
    title: string,
    description: string,
    created_by: number
}

export interface TaskResponse {
    id: number
    title: string,
    description: string,
    state: boolean,
    created_by: number,
    created_at: Date,
    updated_at: Date,
    completed_at: Date,
}

export interface TaskUsersResponse extends TaskResponse {
    created_by: UserResponse,
    users: UserResponse[]
}