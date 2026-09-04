import {FC} from "react";

import {Button, Modal, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useDisclosure} from "@mantine/hooks";

import {PostRoleI} from "@/shared/types/api/roleApi";

interface GroupActionI {
    handleSubmit: (data: PostRoleI)=> Promise<void>
}

export const RoleAction: FC<GroupActionI> = ({handleSubmit}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            name: '',
            is_active: true
        },
    })

    return (
        <>
            <Button mb='2rem' onClick={open}>Создать роль</Button>
            <Modal opened={opened} onClose={close}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Имя"
                        type="text"
                        mb={32}
                        {...form.getInputProps('name')}
                    />
                    <TextInput
                        label="Активен"
                        value="Да"
                        disabled
                        mb={32}
                    />
                    <Button onClick={close} fullWidth type="submit" mb={16}>
                        Создать роль
                    </Button>
                </form>
            </Modal>
        </>
    )
}
