import React, {FC, useEffect, useState} from 'react';

import {ActionIcon, Box, Flex, Loader} from "@mantine/core";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {
    MantineReactTable, MRT_Row,
    useMantineReactTable
} from 'mantine-react-table';
import {MRT_Localization_RU} from "mantine-react-table/locales/ru";

import {UserModal} from "@/pages/userEditor/components/user/user-table/modal/UserModal";
import {userEditorColumns} from "@/shared/tables/userEditor-table/user-editor/userEditorColumns";
import {PatchUserI} from "@/shared/types/api/shiftEditorApi";
import {UserI} from "@/shared/types/userEditorI";


interface UserTableI {
    elements: UserI[] | []
    handleDeleteUser: (id: number) => Promise<void>
    handleGetElements: () => Promise<void>
}

export const UserTable: FC<UserTableI> = ({elements, handleDeleteUser, handleGetElements}) => {
    const [tableData, setTableData] = useState<UserI[]>(() => elements);

    const handleDeleteRow = async (id: number) => {
        await handleDeleteUser(id)
    }



    const UserTable = useMantineReactTable({
        columns: userEditorColumns,
        data: tableData ? tableData : [],
        enableEditing: true,
        localization: MRT_Localization_RU,
        renderEditRowModalContent: ({row, table}) => (
            <UserModal
                row={row as unknown as MRT_Row<PatchUserI>}
                table={table}
                handleGetElements={handleGetElements}
            />
        ),
        mantineTableBodyRowProps: {
            sx: {
                '&:hover td': {
                    backgroundColor: '#DAF1DE !important',
                },
            },
        },
        renderRowActions: ({row}) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                <ActionIcon
                    color="orange"
                    onClick={() => {
                        UserTable.setEditingRow(row);
                    }}
                >
                    <IconEdit />
                </ActionIcon>
                <ActionIcon
                    color="red"
                    onClick={() => {
                        handleDeleteRow(Number(tableData[row.index].id))
                    }}
                >
                    <IconTrash />
                </ActionIcon>
            </Box>
        )
    })


    useEffect(() => {
        setTableData(elements)
    }, [elements]);

    return (
        tableData ? (
            <MantineReactTable
                table={UserTable}
                // onEditingRowSave={handleSaveRow}
            />
        ) : (
            <Flex justify='center'>
                <Loader/>
            </Flex>
        )
    );
};
