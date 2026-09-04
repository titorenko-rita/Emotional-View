import React, {FC, useCallback, useEffect, useState} from 'react';

import {ActionIcon, Box, Flex, Loader} from "@mantine/core";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {
    MantineReactTable, MRT_Row,
    MRT_TableOptions, useMantineReactTable,
} from 'mantine-react-table';
import {MRT_Localization_RU} from "mantine-react-table/locales/ru";

import {useGetUserEditorQuery} from "@/hooks/useGetUserEditorQuery";
import {UserModal} from "@/pages/userEditor/components/user/user-table/modal/UserModal";
import {userEditorColumns} from "@/shared/tables";
import {PatchUserI, RegisterUserI} from "@/shared/types/api/shiftEditorApi";
import {UserI} from "@/shared/types/userEditorI";


interface GroupTableI {
    handleDeleteUser: (id: number) => Promise<void>
    handlePostUser: (data: RegisterUserI)=> Promise<void>
}


export const AllUsersTable: FC<GroupTableI> = ({handleDeleteUser, handlePostUser}) => {
    const [query, setQuery] = useState(1)

    const {handleGetUsers} = useGetUserEditorQuery(query)
    
    const [tableData, setTableData] = useState<UserI[]>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const handleGetUsersElements = useCallback(async () => {
        const getUsers = await handleGetUsers();
        if (tableData.length > 0) {
            setTableData([...tableData, ...getUsers!])
        } else {
            setTableData(getUsers!)
        }
    }, [handleGetUsers, query]);
    
    const SetQuery = useCallback ((newQuery: number) => {
        if (newQuery !== query && query < newQuery) {
            setQuery(newQuery);
        }
    }, [query])
    
    const handleSaveRow: MRT_TableOptions['onEditingRowSave'] =
        async ({table,row,values}) => {
            tableData[row.index] = values as UserI;
            setTableData([...tableData]);
            table.setEditingRow(null);
        };

    const handleDeleteRow = async (id: number) => {
        await handleDeleteUser(id)
        handleGetUsersElements()
    }

    const UsersTable = useMantineReactTable({
        columns: userEditorColumns,
        data: tableData,
        autoResetPageIndex: false,
        state: { pagination },
        onPaginationChange: setPagination,
        paginationDisplayMode: 'pages',
        localization: MRT_Localization_RU,
        enableEditing: true,
        onEditingRowSave: handleSaveRow,
        mantineTableBodyRowProps: {
            sx: {
                '&:hover td': {
                    backgroundColor: '#DAF1DE !important',
                },
            },
        },
        renderEditRowModalContent: ({row, table}) => (
            <UserModal
                row={row as unknown as MRT_Row<PatchUserI>}
                table={table}
                handleGetElements={handleGetUsersElements}
            />
        ),
        renderRowActions: ({row}) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                <ActionIcon
                    color="orange"
                    onClick={() => {
                        UsersTable.setEditingRow(row);
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

    useEffect(()=> {
        handleGetUsersElements()
    }, [handleGetUsersElements, SetQuery, handlePostUser])
    
    useEffect(() => {
        const elementsCount = pagination.pageIndex * pagination.pageSize + pagination.pageSize;
        const elementsQuery = Math.floor(elementsCount / 50) + 1;
        SetQuery(elementsQuery);
    }, [SetQuery, pagination.pageIndex, pagination.pageSize]);

    return (
        tableData.length ? (
            <MantineReactTable
                table={UsersTable}
            />
        ) : (
            <Flex justify='center'>
                <Loader/>
            </Flex>
        )
    )
};
