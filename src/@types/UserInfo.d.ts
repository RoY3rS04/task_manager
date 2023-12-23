import { Request } from "express"

export interface UserInfo {
    name: string,
    gmail: string,
    password: string
}

export interface Password {
    password: string
}

export interface UserResponse {
    id: number
    name: string,
    gmail: string,
    state: boolean,
    created_at: Date,
    updated_at: Date
}

export type GmailInfo = Pick<UserInfo, 'gmail' | 'name'> & { token: string };