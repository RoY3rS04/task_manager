import { UserResponse } from "./UserInfo.js"

export interface TeamInfo {
    name: string,
    created_by: number
}

export interface TeamResponse {
    id: number
    name: string,
    state: boolean,
    created_by: number,
    created_at: Date,
    updated_at: Date,
}

export interface TeamUsersResponse extends TeamResponse {
    created_by: UserResponse,
    members: UserResponse[] 
}