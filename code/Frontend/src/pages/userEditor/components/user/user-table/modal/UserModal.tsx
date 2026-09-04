import React, {FC} from "react";

import {Button, Switch, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {MRT_Row, MRT_TableInstance} from "mantine-react-table";

import {usePatchUserByIdMutation} from "@/app/redux/api/users.api";
import {PatchUserI} from "@/shared/types/api/shiftEditorApi";



interface UserModalI {
    row: MRT_Row<PatchUserI>,
    table: MRT_TableInstance,
    handleGetElements: () => Promise<void>
}

export const UserModal: FC<UserModalI> = ({row, table, handleGetElements}) => {
    const [patchUser] = usePatchUserByIdMutation()

    const handlePatchUser = async (data: PatchUserI) => {
        await patchUser(data)
        table.setEditingRow(null);
        handleGetElements()
    }


    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            id: row.original.id,
            id_role: row.original.id_role,
            id_group: row.original.id_group,
            password: '',
            username: row.original.username,
            is_active: row.original.is_active,
            is_superuser: row.original.is_superuser,
            is_verified: row.original.is_verified,
        },
    })

    return (
        <form onSubmit={form.onSubmit(handlePatchUser)}>
            <TextInput
                label="ID"
                type="number"
                disabled
                mb={32}
                {...form.getInputProps('id')}
            />
            <TextInput
                label="ID роли"
                type="number"
                mb={32}
                {...form.getInputProps('id_role')}
            />
            <TextInput
                label="ID группы терминалов"
                type="number"
                mb={32}
                {...form.getInputProps('id_group')}
            />
            <TextInput
                label="Пароль"
                type="text"
                mb={32}
                {...form.getInputProps('password')}
            />
            <TextInput
                label="Логин"
                type="text"
                mb={32}
                {...form.getInputProps('username')}
            />
            <Switch
                label="Активен"
                mb={32}
                {...form.getInputProps('is_active', {type: 'checkbox'})}
            />
            <Switch
                label="Суперпользователь"
                mb={32}
                {...form.getInputProps('is_superuser', {type: 'checkbox'})}
            />
            <Switch
                label="Верифицирован"
                mb={32}
                {...form.getInputProps('is_verified', {type: 'checkbox'})}
            />
            <Button onClick={close} fullWidth type="submit" mb={16}>
                Обновить пользователя
            </Button>
        </form>
    )
}
