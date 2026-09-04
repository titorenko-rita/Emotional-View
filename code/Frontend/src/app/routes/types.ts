import { ComponentType} from "react";

export interface RouteConfig {
    title: string
    path: string
    component: ComponentType
    type: PageType | PageType[]
}

export enum PageType {
    common = "common",
    root = "root",
    manager = "manager",
    supervisor = "supervisor",
    authenticated = "authenticated",
    unAuthenticated = 'unAuthenticated'
}

export type RoutesType = Record<RouteName, RouteConfig>

export enum RouteName {
    Auth = "auth",
    Profile = "profile",
    ChangePassword = 'changePassword',
    Monitoring = 'monitoring',
    ShiftEditor = 'shiftEditor',
    UserEditor = 'userEditor',
    UploadAI = 'uploadAI',
    Camera = "camera",
}