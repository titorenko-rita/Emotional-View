import React, {FC, useCallback, useEffect, useState} from 'react';

import {ActionIcon, Box, Flex, Loader,} from "@mantine/core";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {
    MantineReactTable, MRT_TableOptions,
    useMantineReactTable
} from 'mantine-react-table';
import {MRT_Localization_RU} from "mantine-react-table/locales/ru";

import {useGetUserEditorQuery} from "@/hooks/useGetUserEditorQuery";
import {raspberryPIColumns} from "@/shared/tables/userEditor-table/raspberrypi-editor/raspberryPIColumns";
import {PatchRPII, PostRPII} from "@/shared/types/api/raspberryPIApi";
import {RaspberryPII} from "@/shared/types/userEditorI";


interface RpiTableI {
    handlePatchRpi: (data: PatchRPII) => Promise<void>
    handleDeleteRpi: (id: number) => Promise<void>
    handlePostRpi: (data: PostRPII) => Promise<void>
}
export const RpiTable: FC<RpiTableI> = ({handlePatchRpi, handleDeleteRpi,handlePostRpi}) => {
    const [query, setQuery] = useState(1)

    const {handleGetRpis} = useGetUserEditorQuery(query)

    const [tableData, setTableData] = useState<RaspberryPII[]>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const handleGetRpisElements = useCallback(async () => {
        const getRpis = await handleGetRpis();
        if (tableData.length > 0) {
            setTableData([...tableData, ...getRpis!])
        } else {
            setTableData(getRpis!)

        }
    }, [handleGetRpis, query]);


    const SetQuery = useCallback ((newQuery: number) => {
        if (newQuery !== query && query < newQuery) {
            setQuery(newQuery);
        }
    }, [query])

    const handleSaveRow: MRT_TableOptions['onEditingRowSave'] =
        async ({table,row,values}) => {
        tableData[row.index] = values as RaspberryPII;
        await handlePatchRpi(tableData[row.index])
        table.setEditingRow(null);
    };
    const handleDeleteRow = async (id: number) => {
        await handleDeleteRpi(id)
        handleGetRpisElements()
    }

    const RpiTable = useMantineReactTable({
        columns: raspberryPIColumns,
        data: tableData ? tableData : [],
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
                        RpiTable.setEditingRow(row);
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
        handleGetRpisElements()
    }, [handleGetRpisElements, SetQuery, handlePostRpi])

    useEffect(() => {
        const elementsCount = pagination.pageIndex * pagination.pageSize + pagination.pageSize;
        const elementsQuery = Math.floor(elementsCount / 50) + 1;
        SetQuery(elementsQuery);
    }, [SetQuery, pagination.pageIndex, pagination.pageSize]);

    return (
        tableData ? (
            <MantineReactTable
                table={RpiTable}
            />
        ) : (
            <Flex justify='center'>
                <Loader/>
            </Flex>
        )
    );
};
