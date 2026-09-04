import { Navigate, Route, Routes } from 'react-router-dom'

import {authenticatedRoutes} from "@/app/routes";
import { useRoutes } from '@/hooks'
import { AppLayout } from '@/layout'

import { RouteConfig } from '../types'

export function AuthenticatedRoutes(): JSX.Element {
    const { paths } = useRoutes()
    return (
        <Routes>
            <Route element={<AppLayout />}>
                {authenticatedRoutes().map(
                    ({ title, component: Element, path }: RouteConfig) => (
                        <Route key={title} element={<Element />} path={path} />
                    )
                )}
                <Route key={-1} path="*" element={<Navigate to={paths.Monitoring} />} />
            </Route>
        </Routes>
    )
}