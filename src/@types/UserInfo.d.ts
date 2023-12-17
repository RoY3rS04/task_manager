export interface UserInfo {
    name: string,
    gmail: string,
    password: string,
    task_id: number|null
}

export interface Password {
    password: string
}

export interface UserResponse {
    id: number
    name: string,
    gmail: string,
    state: boolean,
    task_id: number,
    created_at: Date,
    updated_at: Date
}