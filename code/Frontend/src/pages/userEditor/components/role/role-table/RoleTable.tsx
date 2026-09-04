import React, {FC, useCallback, useEffect, useState} from 'react';

import {ActionIcon, Box, Flex, Loader} from "@mantine/core";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {
    MantineReactTable,
    MRT_TableOptions, useMantineReactTable,
} from 'mantine-react-table';
import {MRT_Localization_RU} from "mantine-react-table/locales/ru";

import {useGetUserEditorQuery} from "@/hooks/useGetUserEditorQuery";
import {roleEditorColumns} from "@/shared/tables/userEditor-table/role-editor/roleEditorColumns";
import {PatchRoleI, PostRoleI} from "@/shared/types/api/roleApi";
import {RoleI} from "@/shared/types/userEditorI";

interface RoleTableI {
    handlePatchRole: (data: PatchRoleI) => Promise<void>
    handleDeleteRole: (id: number) => Promise<void>
    handlePostRole: (data: PostRoleI) => Promise<void>
}


export const RoleTable: FC<RoleTableI> = ({handleDeleteRole, handlePatchRole, handlePostRole}) => {
    const [query, setQuery] = useState(1)

    const {handleGetRoles} = useGetUserEditorQuery(query)

    const [tableData, setTableData] = useState<RoleI[]>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const handleGetRolesElements = useCallback(async () => {
        const getRoles = await handleGetRoles();
        if (tableData.length) {
            setTableData([...tableData, ...getRoles!])
        } else {
            setTableData(getRoles!)

        }
    }, [handleGetRoles, query]);

    const SetQuery = useCallback ((newQuery: number) => {
        if (newQuery !== query && query < newQuery) {
            setQuery(newQuery);
        }
    }, [query])

    const handleSaveRow: MRT_TableOptions['onEditingRowSave'] =
        async ({table,row,values}) => {
            tableData[row.index] = values as RoleI;
            await handlePatchRole(tableData[row.index])
            setTableData([...tableData]);
            table.setEditingRow(null);
        };

    const handleDeleteRow = async (id: number) => {
        await handleDeleteRole(id)
        handleGetRolesElements()
    }

    const RoleTable = useMantineReactTable({
        columns: roleEditorColumns,
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
        renderRowActions: ({row}) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                <ActionIcon
                    color="orange"
                    onClick={() => {
                        RoleTable.setEditingRow(row);
                    }}
                >
                    <IconEdit />
                </ActionIcon>
                <ActionIcon
                    color="red"
                    onClick={() => {
                        handleDeleteRow(tableData[row.index].id)
                    }}
                >
                    <IconTrash />
                </ActionIcon>
            </Box>
        )
    })


    useEffect(()=> {
        handleGetRolesElements()
    }, [handleGetRolesElements, SetQuery, handlePostRole])

    useEffect(() => {
        const elementsCount = pagination.pageIndex * pagination.pageSize + pagination.pageSize;
        const elementsQuery = Math.floor(elementsCount / 50) + 1;
        SetQuery(elementsQuery);
    }, [SetQuery, pagination.pageIndex, pagination.pageSize]);
    
    return (
        tableData.length ? (
            <MantineReactTable
                table={RoleTable}
            />
        ) : (
            <Flex justify='center'>
                <Loader/>
            </Flex>
        )
    );
};
