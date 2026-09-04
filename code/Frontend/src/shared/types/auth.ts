export interface SignInData{
    grant_type?: boolean,
    username: string,
    password: string,
    scope?: string,
    client_id?: number,
    client_secret?: number
}

export interface SignUpData {
    id_role: number,
    id_group: number,
    username: string,
    password: string,
    is_active: boolean,
    is_supervisor: boolean,
    is_verified: boolean
}