import React, {FC, useCallback, useEffect, useState} from "react";

import {ActionIcon, Box, Flex, Loader} from "@mantine/core";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {
    MantineReactTable, MRT_TableOptions, useMantineReactTable
} from 'mantine-react-table';
import {MRT_Localization_RU} from "mantine-react-table/locales/ru";

import {useShiftEditor} from "@/hooks/useShiftEditor";
import {shiftEditorColumns} from "@/shared/tables";
import {PatchShiftEditorI, ShiftEditorI} from "@/shared/types/api/shiftEditorApi/shiftEditorApi";

interface ShiftEditorTableI {
    handlePatchShift: (data: PatchShiftEditorI) => Promise<void>,
    handleDeleteShift: (id: number) => Promise<void>
    dates: {
        date_from: string,
        date_to: string
    }
}

export const ShiftEditorTable: FC<ShiftEditorTableI> = ({handlePatchShift, handleDeleteShift, dates}) => {
    const [query, setQuery] = useState({
        count: 1,
        date_from: '',
        date_to: ''
    })

    const {handleGetShift} = useShiftEditor(query)

    useEffect(() => {
        setQuery({...query, date_from: dates.date_from, date_to: dates.date_to})
    }, [dates]);


    const [tableData, setTableData] = useState<ShiftEditorI[]>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const handleGetShiftElements = useCallback(async () => {
        const getShift = await handleGetShift();
        if (tableData.length) {
            setTableData([...tableData, ...getShift!])
        } else {
            setTableData(getShift!)

        }
    }, [handleGetShift, query]);

    const handleFindElements = useCallback(async () => {
        const getShift = await handleGetShift();
        setTableData(getShift!)
    }, [handleGetShift, query]);

    const SetQuery = useCallback ((newQuery: number) => {
        if (newQuery !== query.count && query.count < newQuery) {
            setQuery({...query, count: newQuery});
        } else {
            handleFindElements()
        }
    }, [query])

    const handleSaveRow: MRT_TableOptions['onEditingRowSave'] =
        async ({table,row,values}) => {
            tableData[row.index] = values as ShiftEditorI;
            await handlePatchShift(tableData[row.index])
            setTableData([...tableData]);
            table.setEditingRow(null);
        };

    const handleDeleteRow = async (id: number) => {
        await handleDeleteShift(id)
    }

    const ShiftTable = useMantineReactTable({
        columns: shiftEditorColumns,
        data: tableData,
        autoResetPageIndex: false,
        enableEditing: true,
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
                        ShiftTable.setEditingRow(row);
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
        handleGetShiftElements()
    }, [handleGetShiftElements, SetQuery, query])

    useEffect(() => {
        const elementsCount = pagination.pageIndex * pagination.pageSize + pagination.pageSize;
        const elementsQuery = Math.floor(elementsCount / 50) + 1;
        SetQuery(elementsQuery);
    }, [SetQuery, pagination.pageIndex, pagination.pageSize]);


    return (
        tableData.length ? (
            <MantineReactTable
                table={ShiftTable}
            />
        ) : (
            <Flex justify='center'>
                <Loader/>
            </Flex>
        )
    );
};
