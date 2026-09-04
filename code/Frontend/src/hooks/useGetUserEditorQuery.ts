import {useCallback} from "react";

import {useGetGroupQuery} from "@/app/redux/api/group.api";
import {useGetRpiQuery} from "@/app/redux/api/raspberryPI.api";
import {useGetRoleQuery} from "@/app/redux/api/role.api";
import {useGetAllUsersQuery} from "@/app/redux/api/users.api";
import {GroupI, RaspberryPII, RoleI, UserI} from "@/shared/types/userEditorI";


export const useGetUserEditorQuery = (count: number) => {
    const {refetch: refetchRoles} = useGetRoleQuery(count)
    const {refetch: refetchGroups} = useGetGroupQuery(count)
    const {refetch: refetchRPI} = useGetRpiQuery(count)
    const {refetch: refetchUsers} = useGetAllUsersQuery(count)

    
    const handleGetRoles = useCallback( async (): Promise<RoleI[] | undefined> => {
        const {data, isError} = await refetchRoles()

        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item)=> item)
        }
        return undefined
    }, [refetchRoles])

    const handleGetGroups = useCallback( async (): Promise<GroupI[] | undefined> => {
        const {data, isError} = await refetchGroups()

        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item)=> item)
        }
        return undefined
    }, [refetchGroups])

    const handleGetRpis = useCallback( async (): Promise<RaspberryPII[] | undefined> => {
        const {data, isError} = await refetchRPI()

        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item)=> item)
        }
        return undefined
    }, [refetchRPI])

    const handleGetUsers = useCallback( async (): Promise<UserI[] | undefined> => {
        const {data, isError} = await refetchUsers()

        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item)=> item)
        }
        return undefined
    }, [refetchUsers])




    return {
        handleGetRoles,
        handleGetRpis,
        handleGetGroups,
        handleGetUsers
    }
}