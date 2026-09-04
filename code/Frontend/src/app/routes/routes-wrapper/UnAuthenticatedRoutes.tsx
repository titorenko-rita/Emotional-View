import { Navigate, Route, Routes } from 'react-router-dom'

import {unAuthenticatedRoutes} from "@/app/routes";
import { useRoutes } from '@/hooks'
import { AppLayout } from '@/layout'

import { RouteConfig } from '../types'

export function UnAuthenticatedRoutes(): JSX.Element {
    const { paths } = useRoutes()
    return (
        <Routes>
            <Route element={<AppLayout />}>
                {unAuthenticatedRoutes().map(
                    ({ title, component: Element, path }: RouteConfig) => {
                        return <Route key={title} element={<Element />} path={path} />
                    }
                )}

                <Route key={-1} path="*" element={<Navigate to={paths.Auth} replace />} />
            </Route>
        </Routes>
    )
}
