import {FC} from "react";

import {Button, Modal, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useDisclosure} from "@mantine/hooks";

import {PostGroupI} from "@/shared/types/api/groupApi";

interface GroupActionI {
    handleSubmit: (data: PostGroupI)=> Promise<void>
}

export const GroupAction: FC<GroupActionI> = ({handleSubmit}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            name: '',
            location: '',
            is_active: true
        },
    })

    return (
        <>
            <Button mb='2rem' onClick={open}>Создать группу терминалов</Button>
            <Modal opened={opened} onClose={close}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Название"
                        type="text"
                        mb={32}
                        {...form.getInputProps('name')}
                    />
                    <TextInput
                        label="Расположение"
                        mb={32}
                        {...form.getInputProps('location')}
                    />
                    <TextInput
                        label="Активен"
                        value="Да"
                        disabled
                        mb={32}
                    />
                    <Button onClick={close} fullWidth type="submit" mb={16}>
                        Создать группу терминалов
                    </Button>
                </form>
            </Modal>
        </>
    )
}
