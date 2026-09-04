export interface PostGroupI {
    name: string,
    location: string,
    is_active: boolean
}

export interface PatchGroupI {
    id: number,
    name: string,
    location: string,
    is_active: true
}