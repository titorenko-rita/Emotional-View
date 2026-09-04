import {FC} from "react";
import {Outlet} from "react-router-dom";

import {AppWrapper} from "@/components/app-wrapper/AppWrapper";


export const AppLayout: FC = (): JSX.Element => (
    <AppWrapper>
        <Outlet/>
    </AppWrapper>
)
