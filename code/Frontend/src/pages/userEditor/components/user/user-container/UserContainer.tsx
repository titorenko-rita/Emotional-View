import React, {FC, useCallback, useEffect, useState} from "react";

import {Flex} from "@mantine/core";

import {
    useDeleteUserByIdMutation,
    useGetUserByIdQuery
} from "@/app/redux/api/users.api";
import {UserTable} from "@/pages/userEditor/components";
import {UserAction} from "@/pages/userEditor/components/user/user-action/UserAction";
import {UserI} from "@/shared/types/userEditorI";


interface UserContainerI {
    handleGetUserById: (refetch: any) => Promise<UserI | undefined>
}

export const UserContainer: FC<UserContainerI> = ({handleGetUserById}) => {
    const [userElements, setUserElements] = useState<UserI | undefined>()
    const [userQuery, setUserQuery] = useState<number>(1)
    const [deleteUser] = useDeleteUserByIdMutation()
    const {refetch: refetchUser} = useGetUserByIdQuery(userQuery)


    const setQuery = useCallback((id: number) => {
        setUserQuery(id)
    }, [userQuery])
    
    const handleGetElements = useCallback(async ()=> {
        const userTable = await handleGetUserById(refetchUser)
        setUserElements(userTable)
    }, [handleGetUserById, refetchUser])


    const handleDeleteUser = async (id: number)=> {
        await deleteUser(id)
        handleGetElements()
    }

    useEffect( ()=> {
        handleGetElements()
    }, [handleGetElements, setQuery])

    return (
        <Flex direction='column'>
            <UserAction
                setQuery={setQuery}
            />
             <UserTable 
                 elements={userElements ? [userElements] : []}
                 handleDeleteUser={handleDeleteUser}
                 handleGetElements={handleGetElements}
             />
        </Flex>
    )
}