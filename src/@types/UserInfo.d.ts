import { Request } from "express"

export interface UserInfo {
    name: string,
    gmail: string,
    image_url?: string,
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
    image_url: string,
    created_at: Date,
    updated_at: Date
}

export type GmailInfo = Pick<UserInfo, 'gmail' | 'name'> & { token: string };