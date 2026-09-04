import { useCallback } from 'react'
import {useNavigate} from "react-router-dom";

import { useAuth } from '@/app/context'
import { useLogoutMutation } from '@/app/redux/api'
import {useRoutes} from "@/hooks";

export const useLogout = (): {
    handleLogout: () => void
    isLoading: boolean
} => {
    const { fetchUser } = useAuth()
    const navigate = useNavigate()
    const {paths} = useRoutes()

    const [logout, { isLoading }] = useLogoutMutation()

    const handleLogout = useCallback(async () => {
        await logout()
        await fetchUser()
        navigate(paths.Auth, {replace: true})
    }, [logout, fetchUser, navigate, paths.Auth])

    return { isLoading, handleLogout }
}
