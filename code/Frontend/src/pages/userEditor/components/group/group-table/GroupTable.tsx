import React, {FC, useCallback, useEffect, useState} from 'react';

import {ActionIcon, Box, Flex, Loader} from "@mantine/core";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {
    MantineReactTable,
    MRT_TableOptions, useMantineReactTable,
} from 'mantine-react-table';
import {MRT_Localization_RU} from "mantine-react-table/locales/ru";

import {useGetUserEditorQuery} from "@/hooks/useGetUserEditorQuery";
import {groupEditorColumns} from "@/shared/tables/userEditor-table/group-editor/groupEditorColumns";
import {PatchGroupI, PostGroupI} from "@/shared/types/api/groupApi";
import {GroupI} from "@/shared/types/userEditorI";


interface GroupTableI {
    handlePatchGroup: (data: PatchGroupI) => Promise<void>,
    handleDeleteGroup: (id: number) => Promise<void>,
    handlePostGroup: (data: PostGroupI)=> Promise<void>
}


export const GroupTable: FC<GroupTableI> = ({handlePatchGroup, handleDeleteGroup, handlePostGroup}) => {
    const [query, setQuery] = useState(1)
    
    const {handleGetGroups} = useGetUserEditorQuery(query)
    
    const [tableData, setTableData] = useState<GroupI[]>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });


    const handleGetGroupsElements = useCallback(async () => {
        const getGroups = await handleGetGroups();
        if (tableData.length) {
            setTableData([...tableData, ...getGroups!])
        } else {
            setTableData(getGroups!)

        }
    }, [handleGetGroups, query]);

    const SetQuery = useCallback ((newQuery: number) => {
        if (newQuery !== query && query < newQuery) {
            setQuery(newQuery);
        }
    }, [query])
    
    const handleSaveRow: MRT_TableOptions['onEditingRowSave'] =
        async ({table,row,values}) => {
            tableData[row.index] = values as GroupI;
            await handlePatchGroup(tableData[row.index])
            setTableData([...tableData]);
            table.setEditingRow(null);
        };

    const handleDeleteRow = async (id: number) => {
        await handleDeleteGroup(id)
        handleGetGroupsElements()
    }

    const GroupTable = useMantineReactTable({
        columns: groupEditorColumns,
        data: tableData,
        enableEditing: true,
        autoResetPageIndex: false,
        state: { pagination },
        onPaginationChange: setPagination,
        paginationDisplayMode: 'pages',
        localization: MRT_Localization_RU,
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
                        GroupTable.setEditingRow(row);
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
        handleGetGroupsElements()
    }, [handleGetGroupsElements, SetQuery, handlePostGroup])

    useEffect(() => {
        const elementsCount = pagination.pageIndex * pagination.pageSize + pagination.pageSize;
        const elementsQuery = Math.floor(elementsCount / 50) + 1;
        SetQuery(elementsQuery);
    }, [SetQuery, pagination.pageIndex, pagination.pageSize]);
    
    
    return (
        tableData.length ? (
            <MantineReactTable
                table={GroupTable}
            />
        ) : (
            <Flex justify='center'>
                <Loader/>
            </Flex>
        )
    );
};
