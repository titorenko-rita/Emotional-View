import { FC, ReactNode } from 'react'

import {Center, Paper} from '@mantine/core'

export const TableWrapper: FC<{
    children: ReactNode
    formId: string
    width?: number | string
    height?: number | string
}> = ({ children, formId, width, height }) => (
    <Center id={formId} w='100%' py={16} h={height || '100%'}>
        <Paper shadow="sm" radius="md" w={width || '100%'} maw={1600} p="xl" withBorder sx={{backgroundColor: '#DAF1DE'}}>
            {children}
        </Paper>
    </Center>
)
