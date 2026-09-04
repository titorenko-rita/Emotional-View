import {Avatar, Stack, Title} from '@mantine/core'

import {UserProfileI} from "../../../../shared/types/profile";

type ProfileHeaderProps = {
    user: UserProfileI | undefined
}

export const ProfileHeader = ({user}: ProfileHeaderProps): JSX.Element => {
    const username = user ? user.username : 'Пользователь'
    const initials = username.slice(0, 2).toUpperCase()

    return (
        <Stack align="center" spacing="sm" mb="xl">
            <Avatar
                radius="xl"
                size={92}
                sx={{
                    backgroundColor: '#235347',
                    color: '#DAF1DE',
                    boxShadow: '0 10px 24px rgba(5, 31, 32, 0.18)',
                    fontSize: 28,
                    fontWeight: 800,
                }}
            >
                {initials}
            </Avatar>
            <Title ta="center" order={3}>
                {username}
            </Title>
        </Stack>
    )
}
