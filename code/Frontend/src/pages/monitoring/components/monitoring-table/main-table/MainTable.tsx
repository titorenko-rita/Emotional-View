import {FC, useCallback, useEffect, useState} from "react";

import {Flex, Loader} from "@mantine/core";
import {MantineReactTable, useMantineReactTable} from "mantine-react-table";
import {MRT_Localization_RU} from "mantine-react-table/locales/ru";

import {useGetMonitoringQuery} from "@/hooks/useGetMonitoringQuery";
import {mainTableColumns} from "@/shared/tables";
import {MainTableI} from "@/shared/types/monitoring";

interface MainTableInterface {
    dates: {
        date_from: string,
        date_to: string
    } 
}

export const MainTable: FC<MainTableInterface> = ({dates }) => {
    const [query, setQuery] = useState({
        count: 1,
        date_from: '',
        date_to: ''
    })

    useEffect(() => {
        setQuery({...query, date_from: dates.date_from, date_to: dates.date_to})
    }, [dates]);
    

    const {handleGetMain} = useGetMonitoringQuery(query)

    const [tableData, setTableData] = useState<MainTableI[]>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const handleGetMainElements = useCallback(async () => {
        const getMain = await handleGetMain();
        if (tableData.length > 0) {
            setTableData([...tableData, ...getMain!])
        } else {
            setTableData(getMain!)
        }

    }, [handleGetMain, query]);

    const handleFindElements = useCallback(async () => {
        const getMain = await handleGetMain();
        setTableData(getMain!)
    }, [handleGetMain, query]);


    const SetQuery = useCallback ((newQuery: number) => {
        if (newQuery !== query.count && query.count < newQuery) {
            setQuery({...query, count: newQuery});
        } else {
            handleFindElements()
        }
    }, [query])


    useEffect(()=> {
        handleGetMainElements()
    }, [handleGetMainElements, SetQuery, query])


    useEffect(() => {
        const elementsCount = pagination.pageIndex * pagination.pageSize + pagination.pageSize;
        const elementsQuery = Math.floor(elementsCount / 50) + 1;
        SetQuery(elementsQuery);
    }, [SetQuery, pagination.pageIndex, pagination.pageSize]);

    const MainTable = useMantineReactTable({
        columns: mainTableColumns,
        data:  tableData ? tableData : [],
        autoResetPageIndex: false,
        state: { pagination },
        onPaginationChange: setPagination,
        paginationDisplayMode: 'pages',
        localization: MRT_Localization_RU,
    })

    return (
        tableData ? (
            <MantineReactTable
                table={MainTable}
            />
        ) : (
            <Flex justify='center'>
                <Loader/>
            </Flex>
        )
    );
};
