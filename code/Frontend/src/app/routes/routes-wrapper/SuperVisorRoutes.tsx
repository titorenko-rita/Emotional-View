
import {Navigate, Route, Routes} from "react-router-dom";

import {superVisorRoutes} from "@/app/routes";
import { useRoutes } from '@/hooks'
import { AppLayout } from '@/layout'

import { RouteConfig } from '../types'

export function SuperVisorRoutes(): JSX.Element {
    const { paths } = useRoutes()
    return (
        <Routes>
            <Route element={<AppLayout />}>
                {superVisorRoutes().map(
                    ({ title, component: Element, path }: RouteConfig) => (
                        <Route key={title} element={<Element />} path={path} />
                    )
                )}
                <Route key={-1} path="*" element={<Navigate to={paths.Monitoring} />} />
            </Route>
        </Routes>
    )
}