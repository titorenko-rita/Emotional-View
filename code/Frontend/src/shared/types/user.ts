export type User = {
    id_role: number
    id_group: number
    password: string
    username: string
    is_active: boolean
    is_supervisor: boolean
    is_verified: boolean
}

export type Password = { oldPassword: string; newPassword: string }