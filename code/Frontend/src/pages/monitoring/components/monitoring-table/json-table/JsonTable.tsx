import {FC, useCallback, useEffect, useState} from "react";

import {Flex, Loader} from "@mantine/core";
import {MantineReactTable, useMantineReactTable} from "mantine-react-table";
import {MRT_Localization_RU} from "mantine-react-table/locales/ru";

import {useGetMonitoringQuery} from "@/hooks/useGetMonitoringQuery";
import {jsonTableColumns} from "@/shared/tables";
import {JsonTableI} from "@/shared/types/monitoring";


interface JsonTableInterface {
    dates: {
        date_from: string,
        date_to: string
    }
}

export const JsonTable: FC<JsonTableInterface> = ({dates}) => {
    const [query, setQuery] = useState({
        count: 1,
        date_from: '',
        date_to: ''
    })

    useEffect(() => {
        setQuery({...query, date_from: dates.date_from, date_to: dates.date_to})
    }, [dates]);

    const {handleGetJson} = useGetMonitoringQuery(query)

    const [tableData, setTableData] = useState<JsonTableI[]>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });


    const handleGetJsonElements = useCallback(async () => {
        const getMain = await handleGetJson();
        if (tableData.length > 0) {
            setTableData([...tableData, ...getMain!])
        } else {
            setTableData(getMain!)
        }

    }, [handleGetJson, query]);

    const handleFindElements = useCallback(async () => {
        const getJson = await handleGetJson();
        setTableData(getJson!)
    }, [handleGetJson, query]);

    const SetQuery = useCallback ((newQuery: number) => {
        if (newQuery !== query.count && query.count < newQuery) {
            setQuery({...query, count: newQuery});
        } else {
            handleFindElements()
        }
    }, [query])

    useEffect(()=> {
        handleGetJsonElements()
    }, [handleGetJsonElements, SetQuery, query])


    useEffect(() => {
        const elementsCount = pagination.pageIndex * pagination.pageSize + pagination.pageSize;
        const elementsQuery = Math.floor(elementsCount / 50) + 1;
        SetQuery(elementsQuery);
    }, [SetQuery, pagination.pageIndex, pagination.pageSize]);


    const JsonTable = useMantineReactTable({
        columns: jsonTableColumns,
        data: tableData ? tableData : [],
        autoResetPageIndex: false,
        state: { pagination },
        onPaginationChange: setPagination,
        paginationDisplayMode: 'pages',
        localization: MRT_Localization_RU,
    })
    return (
        tableData ? (
            <MantineReactTable
                table={JsonTable}
            />
        ) : (
            <Flex justify='center'>
                <Loader/>
            </Flex>
        )
    );
};
