import { FC } from 'react'

import { Alert, Button, PasswordInput, TextInput } from '@mantine/core'
import {useForm} from "@mantine/form";

import {SignInData} from "@/shared";

type LoginFormProps = {
    handleSubmit: (data: SignInData) => void
    errorMessage?: string
}
export const LoginForm: FC<LoginFormProps> = ({handleSubmit, errorMessage}): JSX.Element => {

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            username: '',
            password: '',
        },
    })


    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                withAsterisk
                label="Логин"
                placeholder="Ваш логин"
                type="text"
                mb={32}
                {...form.getInputProps('username')}
            />
            <PasswordInput
                withAsterisk
                label="Пароль"
                placeholder="Ваш пароль"
                mb={32}
                {...form.getInputProps('password')}
            />
            <Button fullWidth type="submit" mb={16}>
                Войти
            </Button>
            {errorMessage && (
                <Alert color="red" title="Ошибка авторизации">
                    {errorMessage}
                </Alert>
            )}
        </form>
    )
}
