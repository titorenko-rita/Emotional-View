import {useCallback, useEffect, useState} from "react";
import {Link} from "react-router-dom";

import {Button, Flex, Group, Paper, Title} from "@mantine/core";

import {useRoutes} from "@/hooks";
import {useLogout} from "@/hooks/useLogout";
import {useProfile} from "@/hooks/useProfile";
import {ProfileData, ProfileHeader} from "@/pages/profile/components";
import {UserProfileI} from "@/shared/types/profile";

export const Profile = () => {
    const {handleLogout} = useLogout()
    const {handleGetProfile} = useProfile()
    const {paths} = useRoutes()

    const [user, setUser] = useState<UserProfileI>()

    const handleGetProfileInfo = useCallback(async () => {
        const data: UserProfileI | undefined = await handleGetProfile()
        setUser(data)
    }, [handleGetProfile])

    useEffect(() => {
        handleGetProfileInfo()
    }, [handleGetProfileInfo]);

    const dangerHover = {
        '&:hover': {
            backgroundColor: '#c5321d',
        },
    }

    return (
        <Flex
            id="profile"
            py={16}
            align="center"
            direction="column"
        >
            <Paper shadow="xs" py="xl" px="xl" w={520}>
                <Title mb="xl" ta="center">
                    Профиль пользователя
                </Title>
                <ProfileHeader user={user}/>
                <ProfileData user={user}/>
                <Group position="center" spacing="md">
                    <Button component={Link} to={paths.ChangePassword} sx={dangerHover}>
                        Изменить пароль
                    </Button>
                    <Button onClick={handleLogout} sx={dangerHover}>
                        Выйти
                    </Button>
                </Group>
            </Paper>
        </Flex>
    )
}
