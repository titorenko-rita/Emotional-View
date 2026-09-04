import React from "react";

import {Flex} from "@mantine/core";

import {
    useDeleteGroupMutation,
    usePatchGroupMutation,
    usePostGroupMutation
} from "@/app/redux/api/group.api";
import {GroupTable} from "@/pages/userEditor/components";
import {GroupAction} from "@/pages/userEditor/components/group/group-action/GroupAction";
import {PatchGroupI, PostGroupI} from "@/shared/types/api/groupApi";


export const GroupContainer = () => {
    const [postGroup] = usePostGroupMutation()
    const [patchGroup] = usePatchGroupMutation()
    const [deleteGroup] = useDeleteGroupMutation()
    

    const handlePostGroup = async (data: PostGroupI) => {
        await postGroup(data)
    }

    const handlePatchGroup = async (data: PatchGroupI) => {
        await patchGroup(data)
    }

    const handleDeleteGroup = async (id: number) => {
        await deleteGroup(id)
    }

    return (
        <Flex direction='column'>
            <GroupAction handleSubmit={handlePostGroup}/>
            <GroupTable
                handlePatchGroup={handlePatchGroup}
                handleDeleteGroup={handleDeleteGroup}
                handlePostGroup={handlePostGroup}
            />;
        </Flex>
    )
}