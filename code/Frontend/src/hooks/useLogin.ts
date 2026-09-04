import { useCallback, useState } from 'react'

import {useAuth} from "@/app/context/auth-provider/AuthProvider";
import { useLazyCheckUsernameQuery, useSigninMutation } from '@/app/redux/api'
import { SignInData } from '@/shared'

export const useLogin = (): {
    handleLogin: (data: SignInData) => void
    isLoading: boolean
    errorMessage: string
} => {
    const { fetchUser } = useAuth()
    const [errorMessage, setErrorMessage] = useState('')

    const [signin, { isLoading }] = useSigninMutation()
    const [checkUsername] = useLazyCheckUsernameQuery()

    const handleLogin = useCallback(
        async (data: SignInData) => {
            try {
                setErrorMessage('')
                await signin(data).unwrap()
                await fetchUser()
            } catch {
                try {
                    const result = await checkUsername(data.username).unwrap()
                    setErrorMessage(
                        result.exists
                            ? 'Неверно введён пароль'
                            : `Пользователь с логином ${data.username} отсутствует`
                    )
                } catch {
                    setErrorMessage('Не удалось выполнить вход. Проверьте логин и пароль')
                }
            }
        },
        [signin, fetchUser, checkUsername]
    )

    return { isLoading, handleLogin, errorMessage }
}
