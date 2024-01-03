import { Request } from "express"

export interface UserInfo {
    name: string,
    email: string,
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

export type GmailInfo = Pick<UserInfo, 'email' | 'name'> & { token: string };