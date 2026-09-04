import {FC} from "react";
import {Link} from "react-router-dom";

import {Flex, Menu, Text} from "@mantine/core";

import {RoutesPathType} from "@/hooks";


interface ManagerNavigationI {
    paths: RoutesPathType
}

export const ManagerNavigation: FC<ManagerNavigationI> = ({paths}) => {
    const itemSx = {
        backgroundColor: 'transparent',
        width: 'auto',
        padding: '8px 12px',
        borderRadius: 6,
        transition: 'background-color 160ms ease, transform 160ms ease',
        '&:hover': {
            backgroundColor: 'rgba(142, 182, 155, 0.28)',
            transform: 'translateY(-1px)',
        },
        '&:hover .navigation-link': {
            color: '#051F20',
        },
        '&:hover .navigation-link::after': {
            transform: 'scaleX(1)',
        },
    }
    const textSx = {
        position: 'relative' as const,
        color: '#235347',
        fontWeight: 700,
        transition: 'color 160ms ease',
        '&::after': {
            content: '""',
            position: 'absolute' as const,
            left: 0,
            right: 0,
            bottom: -3,
            height: 2,
            backgroundColor: '#051F20',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 180ms ease',
        },
    }

    return (
        <Flex justify='center' gap="sm" wrap="wrap">
            <Menu.Item sx={itemSx} component={Link} to={paths.Profile}>
                <Text className="navigation-link" sx={textSx} size='xl'>
                    Профиль
                </Text>
            </Menu.Item>

            <Menu.Item sx={itemSx} component={Link} to={paths.Monitoring}>
                <Text className="navigation-link" sx={textSx} size='xl'>
                    Мониторинг
                </Text>
            </Menu.Item>

            <Menu.Item sx={itemSx} component={Link} to={paths.ShiftEditor}>
                <Text className="navigation-link" sx={textSx} size='xl'>
                    Смены
                </Text>
            </Menu.Item>

            {/* <Menu.Item sx={itemSx} component={Link} to={paths.UploadAI}>
                <Text className="navigation-link" sx={textSx} size='xl'>
                    Загрузка ИИ
                </Text>
            </Menu.Item> */}
            <Menu.Item sx={itemSx} component={Link} to={paths.Camera}>
                <Text className="navigation-link" sx={textSx} size='xl'>
                    Камера
                </Text>
            </Menu.Item>
        </Flex>
    )
}
