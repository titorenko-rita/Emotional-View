import {useMemo} from "react";
import {useNavigate} from "react-router-dom";

import {generateRoutePath, RouteName} from "@/app/routes";


type NavigateType = {[k: string]: ()=> void}

type RoutesReturnType = {
    paths: RoutesPathType
    navigateTo: NavigateType
}

export type RoutesPathType = Record<keyof typeof RouteName, string>

export const useRoutes = (): RoutesReturnType => {
    const navigate = useNavigate()

    const Auth = useMemo(
        ()=> generateRoutePath({
            name: RouteName.Auth
        }),
        []
    )

    const UserEditor = useMemo(
        ()=> generateRoutePath({
            name: RouteName.UserEditor
        }),
        []
    )

    const ShiftEditor = useMemo(
        ()=> generateRoutePath({
            name: RouteName.ShiftEditor
        }),
        []
    )

    const Monitoring = useMemo(
        ()=> generateRoutePath({
            name: RouteName.Monitoring
        }),
        []
    )

    const Profile = useMemo(
        ()=> generateRoutePath({
            name: RouteName.Profile
        }),
        []
    )

    const ChangePassword = useMemo(
        ()=> generateRoutePath({
            name: RouteName.ChangePassword
        }),
        []
    )


    const UploadAI = useMemo(
        ()=> generateRoutePath({
            name: RouteName.UploadAI
        }),
        []
    )

    const Camera = useMemo(
        () => generateRoutePath({ name: RouteName.Camera }),
        []
    );


    const paths: RoutesPathType = useMemo(()=> {
        return {
            Auth,
            UserEditor,
            ShiftEditor,
            Monitoring,
            Profile,
            ChangePassword,
            UploadAI,
            Camera,
        }
    }, [
        Auth,
        UserEditor,
        ShiftEditor,
        Monitoring,
        Profile,
        ChangePassword,
        UploadAI,
        Camera,
    ])

    const navigateTo: NavigateType = useMemo(
        ()=> Object.entries(paths).reduce((acc, [key,value]) => {
            return {
                ...acc,
                [key]: ()=> navigate(value),
            }
        }, {}), [navigate, paths])


    return {
        paths,
        navigateTo
    }
}