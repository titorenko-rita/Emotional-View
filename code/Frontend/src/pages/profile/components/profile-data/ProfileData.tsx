import { FC } from 'react'

import {Box, SimpleGrid, Text} from '@mantine/core'

import {UserProfileI} from "../../../../shared/types/profile";

export type ProfileDataProps = {
    user: UserProfileI | undefined
}

export const ProfileData: FC<ProfileDataProps> = ({ user }) => {
    return (
        <SimpleGrid cols={2} verticalSpacing="xl" spacing="xl" mb={36}>
            <Box>
                <Text ta="left">Роль</Text>
            </Box>
            <Box>
                <Text ta="right">{user ? user.role_name : 'Не указана'}</Text>
            </Box>

            <Box>
                <Text ta="left">Группа терминалов</Text>
            </Box>
            <Box>
                <Text ta="right">{user ? user.group_name : "Не указана"}</Text>
            </Box>

        </SimpleGrid>
    )
}
