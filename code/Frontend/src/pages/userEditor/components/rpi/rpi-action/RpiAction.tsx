import {FC} from "react";

import {Button, Modal, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useDisclosure} from "@mantine/hooks";

import {PostRPII} from "@/shared/types/api/raspberryPIApi";

interface ActionI {
    handleSubmit: (data: PostRPII) => Promise<void>
}

export const RpiAction: FC<ActionI> = ({handleSubmit}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            id_group: 0,
            mac: '',
            is_active: true
        },
    })

    return (
        <>
            <Button mb='2rem' onClick={open}>Добавить терминал</Button>
            <Modal opened={opened} onClose={close}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="ID группы терминалов"
                        type="number"
                        mb={32}
                        {...form.getInputProps('id_group')}
                    />
                    <TextInput
                        label="MAC-адрес"
                        type="text"
                        mb={32}
                        {...form.getInputProps('mac')}
                    />
                    <TextInput
                        label="Активен"
                        value="Да"
                        disabled
                        mb={32}
                    />
                    <Button onClick={close} fullWidth type="submit" mb={16}>
                        Добавить терминал
                    </Button>
                </form>
            </Modal>
        </>
    )
}
