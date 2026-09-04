import { Title } from '@mantine/core'

import { FormWrapper } from '@/components'
import {useAppSelector} from "@/hooks/useAppSelector";
import {useProfile} from "@/hooks/useProfile";
import {ChangePasswordForm} from "@/pages/change-password/components";
import {PatchUserI} from "@/shared/types/api/shiftEditorApi";


export const ChangePassword = (): JSX.Element => {
    const { handlePatchUser } = useProfile()

    const user = useAppSelector(state => state.user.currentUser)

    const handleSubmit = async ({oldPassword, newPassword} : {oldPassword: string, newPassword: string}) => {
        if (oldPassword === newPassword) {
            await handlePatchUser({...user, password: newPassword} as unknown as PatchUserI)
        }
    }

    return (
        <FormWrapper formId="change-password">
            <Title mb={16}>
                Изменить пароль
            </Title>
            <ChangePasswordForm handleSubmit={handleSubmit} />
        </FormWrapper>
    )
}