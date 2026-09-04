import React from "react";

import {Flex} from "@mantine/core";

import {useDeleteUserByIdMutation, useRegisterUserMutation} from "@/app/redux/api/users.api";
import {AllUsersTable} from "@/pages/userEditor/components/allUsers";
import {AllUsersAction} from "@/pages/userEditor/components/allUsers/allUsers-action/AllUsersAction";
import {RegisterUserI} from "@/shared/types/api/shiftEditorApi";


export const AllUsersContainer = () => {
    const [postUser] = useRegisterUserMutation()
    const [deleteUser] = useDeleteUserByIdMutation()

    const handlePostUser = async (data: RegisterUserI) => {
        await postUser(data)
    }

    const handleDeleteUser = async (id: number) => {
        await deleteUser(id)
    }

    return (
        <Flex direction='column'>
            <AllUsersAction handleSubmit={handlePostUser}/>
            <AllUsersTable
                handleDeleteUser={handleDeleteUser}
                handlePostUser={handlePostUser}
            />
        </Flex>
    )
}