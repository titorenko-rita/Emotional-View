
export interface GroupI{
    id: number,
    name: string,
    location: string,
    is_active: true
}

export interface UserI {
    id: string,
    id_role: number,
    id_group: number,
    username: string,
    is_active: true,
    is_superuser: boolean,
    is_verified: boolean
}

export interface RaspberryPII{
    id: number,
    id_group: number,
    group_name: string,
    mac: string,
    is_active: true,
    is_work: boolean
}

export interface RoleI {
    id: number,
    name: string,
    is_active: true
}