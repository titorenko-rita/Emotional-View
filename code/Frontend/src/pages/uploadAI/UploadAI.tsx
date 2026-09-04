import {FileInput, Flex} from "@mantine/core";
import {useForm} from "@mantine/form";
import {IconUpload} from "@tabler/icons-react";

import {useUploadFiles} from "@/hooks/useUploadFiles";


export const UploadAI = ()=> {
    const {handleSendFile} = useUploadFiles()

    const form = useForm({
        initialValues: {
            upload_file: null,
        }
    })

    return (
        <Flex w='100%' h='100%' justify='center' align='center' direction='column'>
            <form onChange={handleSendFile}>
                    <FileInput
                        mb='1rem'
                        size='xl'
                        label="Загрузка ии"
                        icon={<IconUpload size="14px" />}
                        description="Перетащите или кликните"
                        styles={{
                            description: {
                                color: '#235347',
                                fontWeight: 700,
                            },
                            label: {
                                color: '#051F20',
                                fontWeight: 800,
                            },
                        }}
                        {...form.getInputProps('avatar')}
                    />
            </form>
        </Flex>

    )
}
