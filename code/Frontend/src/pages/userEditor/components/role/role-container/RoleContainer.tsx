import React from "react";

import {Flex} from "@mantine/core";

import {
    useDeleteRoleMutation,
    usePatchRoleMutation,
    usePostRoleMutation
} from "@/app/redux/api/role.api";
import {RoleTable} from "@/pages/userEditor/components";
import {RoleAction} from "@/pages/userEditor/components/role/role-action/RoleAction";
import {PatchRoleI, PostRoleI} from "@/shared/types/api/roleApi";



export const RoleContainer = () => {
    const [postRole] = usePostRoleMutation()
    const [patchRole] = usePatchRoleMutation()
    const [deleteRole] = useDeleteRoleMutation()


    const handlePostRole = async (data: PostRoleI) => {
        await postRole(data)
    }

    const handlePatchRole = async (data: PatchRoleI) => {
        await patchRole(data)
    }

    const handleDeleteRole = async (id: number) => {
        await deleteRole(id)
    }

    return (
        <Flex direction='column'>
            <RoleAction handleSubmit={handlePostRole}/>
            <RoleTable
                handlePatchRole={handlePatchRole}
                handleDeleteRole={handleDeleteRole}
                handlePostRole={handlePostRole}
            />
        </Flex>
    );
}