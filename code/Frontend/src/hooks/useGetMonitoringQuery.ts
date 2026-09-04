import {useCallback} from "react";

import {useGetJsonQuery, useGetMainTableQuery} from "@/app/redux";
import {JsonTableI, MainTableI} from "@/shared/types/monitoring";

export interface QueryI {
    count: number,
    date_from: string,
    date_to: string
}


export const useGetMonitoringQuery = (query: QueryI) => {
    const {refetch: refetchMain} = useGetMainTableQuery({
        date_from: query.date_from,
        date_to: query.date_to,
        count: query.count
    })

    const {refetch: refetchJson} = useGetJsonQuery({
        date_from: query.date_from,
        date_to: query.date_to,
        count: query.count
    })



    const handleGetMain = useCallback( async (): Promise<MainTableI[] | undefined> => {
        const {data, isError} = await refetchMain()

        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item)=> item)
        }
        return undefined
    }, [refetchMain])

    const handleGetJson = useCallback( async (): Promise<JsonTableI[] | undefined> => {
        const {data, isError} = await refetchJson()

        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item)=> item)
        }
        return undefined
    }, [refetchJson])



    return {
        handleGetMain,
        handleGetJson,
    }
}