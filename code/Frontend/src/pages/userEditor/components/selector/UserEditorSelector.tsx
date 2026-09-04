import {FC} from "react";

import {Button, Flex} from "@mantine/core";

import {UserEditorActiveTab} from "@/shared/types/activeTabs";

interface UserEditorSelectorI {
    setTable: (x: UserEditorActiveTab)=> void
}


export const UserEditorSelector: FC<UserEditorSelectorI> = ({setTable}) => {
    const handleSetUser = () => {
        setTable(UserEditorActiveTab.findUser)
    }

    const handleSetUsers = () => {
        setTable(UserEditorActiveTab.findAllUsers)
    }

    const handleSetGroup = () => {
        setTable(UserEditorActiveTab.findGroup)
    }
    const handleSetRole = () => {
        setTable(UserEditorActiveTab.findRole)
    }
    const handleSetRpi = () => {
        setTable(UserEditorActiveTab.findRpi)
    }

    return (
        <Flex justify='space-around' mb='2rem'>
            <Button onClick={handleSetUsers}>Найти пользователей</Button>
            <Button onClick={handleSetUser}>Найти пользователя по ID</Button>
            <Button onClick={handleSetRole}>Найти роль</Button>
            <Button onClick={handleSetGroup}>Найти группу терминалов</Button>
            <Button onClick={handleSetRpi}>Найти терминал</Button>
        </Flex>
    )
}
