import { UserResponse } from "./UserInfo.js"

export interface TeamInfo {
    name: string,
    created_by: number,
    image_url?: string
}

export interface TeamResponse {
    id: number
    name: string,
    state: boolean,
    image_url: string,
    created_by: number,
    created_at: Date,
    updated_at: Date,
}

export interface TeamUsersResponse<T> extends TeamResponse {
    created_by: UserResponse,
    members: T
}