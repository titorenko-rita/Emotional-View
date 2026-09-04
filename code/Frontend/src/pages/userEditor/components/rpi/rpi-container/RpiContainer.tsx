import React from "react";

import {Flex} from "@mantine/core";

import {
    useDeleteRpiMutation,
    usePatchRpiMutation,
    usePostRpiMutation
} from "@/app/redux/api/raspberryPI.api";
import {RpiTable} from "@/pages/userEditor/components";
import {RpiAction} from "@/pages/userEditor/components/rpi/rpi-action";
import {PatchRPII, PostRPII} from "@/shared/types/api/raspberryPIApi";

export const RpiContainer= () => {
    const [postRpi] = usePostRpiMutation()
    const [patchRpi] = usePatchRpiMutation()
    const [deleteRpi] = useDeleteRpiMutation()

    const handlePostRpi = async (data: PostRPII) => {
        await postRpi(data)
    }
    
    const handlePatchRpi = async (data: PatchRPII) => {
        await patchRpi(data)
    }

    const handleDeleteRpi = async (id: number) => {
        await deleteRpi(id)
    }

    return (
        <Flex direction='column'>
            <RpiAction  handleSubmit={handlePostRpi}/>
            <RpiTable
                handlePatchRpi={handlePatchRpi}
                handleDeleteRpi={handleDeleteRpi}
                handlePostRpi={handlePostRpi}
            />;
        </Flex>
    )
}

