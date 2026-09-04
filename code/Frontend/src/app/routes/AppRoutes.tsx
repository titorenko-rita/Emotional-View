import { Center, Loader } from '@mantine/core'

import {useAuth} from "@/app/context/auth-provider/AuthProvider";
import {AuthenticatedRoutes, UnAuthenticatedRoutes} from "@/app/routes/routes-wrapper";
import {ManagerRoutes} from "@/app/routes/routes-wrapper/ManagerRoutes";
import {RootRoutes} from "@/app/routes/routes-wrapper/RootRoutes";
import {SuperVisorRoutes} from "@/app/routes/routes-wrapper/SuperVisorRoutes";
import {useAppSelector} from "@/hooks/useAppSelector";
import {Roles} from "@/shared/types/roles";

export const AppRoutes = (): JSX.Element => {
    const { authenticated, initializing } = useAuth()
    const user = useAppSelector(state => state.user.currentUser)

    if (initializing) {
        return (
            <Center sx={{ width: '100vw', height: '100vh' }}>
                <Loader size="lg" variant="bars" />
            </Center>
        )
    }



    let RouteComponent;

    switch (user?.id_role) {
        case Roles.root:
            RouteComponent = RootRoutes;
            break;
        case Roles.supervisor:
            RouteComponent = SuperVisorRoutes;
            break;
        case Roles.manager:
            RouteComponent = ManagerRoutes;
            break;
        default:
            RouteComponent = authenticated ? AuthenticatedRoutes : UnAuthenticatedRoutes;
    }


    return <RouteComponent />;
}