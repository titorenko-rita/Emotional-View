import {FC} from "react";

import {Button, Modal, Switch, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useDisclosure} from "@mantine/hooks";

import {RegisterUserI} from "@/shared/types/api/shiftEditorApi";

interface AllUsersAction {
    handleSubmit: (data: RegisterUserI)=> Promise<void>
}

export const AllUsersAction: FC<AllUsersAction> = ({handleSubmit}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            id_role: '',
            id_group: '',
            password: '',
            username: '',
            is_active: true,
            is_superuser: false,
            is_verified: false
        },
    })

    return (
        <>
            <Button mb='2rem' onClick={open}>Создать пользователя</Button>
            <Modal opened={opened} onClose={close}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
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
                        Создать пользователя
                    </Button>
                </form>
            </Modal>
        </>
    )
}
