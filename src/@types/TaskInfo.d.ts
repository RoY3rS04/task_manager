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
    created_by: UserResponse,
    created_at: Date,
    updated_at: Date,
    completed_at: Date,
    users: UserResponse[]
}