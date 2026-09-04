
import {Button, Collapse, Flex, Group, Menu, Paper, Stack} from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";

import {ManagerNavigation} from "@/components/navigation-bar/roles-navigation/ManagerNavigation";
import {RootNavigation} from "@/components/navigation-bar/roles-navigation/RootNavigation";
import {SupervisorNavigation} from "@/components/navigation-bar/roles-navigation/SupervisorNavigation";
import {useRoutes} from "@/hooks";
import {useAppSelector} from "@/hooks/useAppSelector";
import {Roles} from "@/shared/types/roles";


export const NavigationHeader = () =>  {
    const {paths} = useRoutes()
    const [opened, { toggle }] = useDisclosure(false);
    const user = useAppSelector(state => state.user.currentUser)

    let NavigationComponent;

    switch (user?.id_role) {
        case Roles.root:
            NavigationComponent = <RootNavigation paths={paths}/>
            break
        case Roles.manager:
            NavigationComponent = <ManagerNavigation paths={paths}/>
            break
        case Roles.supervisor:
            NavigationComponent = <SupervisorNavigation paths={paths}/>
            break
    }

    return (
        user?.id_role && (
            <Flex align='center' direction='column' mb='2rem'>
                <Group mb={8}>
                    <Button onClick={toggle}>Навигация</Button>
                </Group>
                <Collapse in={opened}>
                    <Paper radius="md" p="xs" withBorder w="min(92vw, 980px)">
                    <Stack p="xs" w='100%'>
                        <Menu>
                            {NavigationComponent}
                        </Menu>
                    </Stack>
                    </Paper>
                </Collapse>
            </Flex>
        )
    );
}
