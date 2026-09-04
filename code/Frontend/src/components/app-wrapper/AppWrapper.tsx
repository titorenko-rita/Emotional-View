import { FC, ReactNode } from 'react'

import {AppShell, Center, Container} from '@mantine/core'

import {NavigationHeader} from "@/components";

export const AppWrapper: FC<{
    children: ReactNode
}> = ({ children }) => (
    <Container
        fluid
        mih="100vh"
        px={0}
        sx={theme => ({
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : '#8EB69B',
        })}>
        <AppShell
            styles={{
                main: {
                    minHeight: '100vh',
                    padding: '24px 16px 48px',
                },
            }}
        >
            <NavigationHeader/>
            <Center w="100%">
                {children}
            </Center>
        </AppShell>
    </Container>
)
