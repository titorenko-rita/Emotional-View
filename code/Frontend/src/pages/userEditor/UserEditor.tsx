import React, {useState} from "react";

import {Flex, Text} from "@mantine/core";

import {TableWrapper} from "@/components/monitoring-wrapper";
import {useGetUserByIdHook} from "@/hooks/useGetUserByIdHook";
import {AllUsersContainer} from "@/pages/userEditor/components/allUsers/allUsers-container";
import {GroupContainer} from "@/pages/userEditor/components/group/group-container";
import {RoleContainer} from "@/pages/userEditor/components/role/role-container";
import {RpiContainer} from "@/pages/userEditor/components/rpi/rpi-container";
import {UserEditorSelector} from "@/pages/userEditor/components/selector";
import {UserContainer} from "@/pages/userEditor/components/user/user-container";
import {UserEditorActiveTab} from "@/shared/types/activeTabs";


export const UserEditor = ()=> {
    const {handleGetUserById} = useGetUserByIdHook()

    const [table, setTable] =
        useState<UserEditorActiveTab>(UserEditorActiveTab.findUser)


    const handleSwitchTable = () => {
        return (() => {
            switch (table) {
                case (UserEditorActiveTab.findUser):
                    return <UserContainer handleGetUserById={handleGetUserById} />
                case (UserEditorActiveTab.findRole):
                    return <RoleContainer/>
                case (UserEditorActiveTab.findGroup):
                    return <GroupContainer/>
                case (UserEditorActiveTab.findRpi):
                    return <RpiContainer/>
                case (UserEditorActiveTab.findAllUsers):
                    return <AllUsersContainer/>
            }
        })()
    };

    return (
        <TableWrapper formId='monitoring' width='98%' height=''>
            <Flex justify='center' mb='2rem'>
                <Text size='xl'>{table}</Text>
            </Flex>
            <UserEditorSelector
                setTable={setTable}
            />
            {
                handleSwitchTable()
            }
        </TableWrapper>
    )
}
