
export interface ShiftEditorI {
    id: number,
    id_raspberry: number,
    id_kassa: number,
    id_worker: number,
    date_from: string,
    date_to: string
}

export interface PostShiftEditorI {
    id_raspberry: number,
    id_kassa: number,
    id_worker: number,
    date_from: string,
    date_to: string
}

export interface PostShiftI {
    id_raspberry: string,
    id_kassa: string,
    id_worker: string,
    data_range: [Date | null, Date | null]
    time_from: string,
    time_to: string
}

export interface PatchShiftEditorI {
    id: number,
    id_raspberry: number,
    id_kassa: number,
    id_worker: number,
    date_from: string,
    date_to: string
}

export interface PatchUserI {
    id: string,
    id_role: string,
    id_group: string,
    password: string,
    username: string,
    is_active: true,
    is_superuser: boolean,
    is_verified: boolean
}

export interface GetAllUsersI {
    id: string
    id_role: number,
    id_group: number,
    username: string,
    is_active: true,
    is_superuser: true,
    is_verified: true
}

export interface RegisterUserI {
    id_role: string,
    id_group: string,
    password: string,
    username: string,
    is_active: boolean,
    is_superuser: boolean,
    is_verified: boolean
}