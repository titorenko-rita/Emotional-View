import {
    useGetAllTableRatesQuery,
    useGetEmotionSessionsQuery,
    useGetJsonTableRatesQuery,
    useGetMainTableRatesQuery
} from "@/app/redux";
import {useCallback} from "react";
import {MainTableRates} from "@/shared/types/rates";
import {EmotionSessionI} from "@/shared/types/monitoring";

interface query {
    date_from: string,
    date_to: string
}

export const useGetMonitoringData = (query: query) => {
    const {refetch: refetchMainRates} = useGetMainTableRatesQuery(query)
    const {refetch: refetchJsonRates} = useGetJsonTableRatesQuery(query)
    const {refetch: refetchAllRates} = useGetAllTableRatesQuery(query)
    const {refetch: refetchEmotionSessions} = useGetEmotionSessionsQuery(query)

    const handleGetMainRates = useCallback(async (): Promise<MainTableRates[] | undefined> => {
        const {data, isError} = await refetchMainRates()
        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item)=> item)
        }
        return undefined
    }, [])

    const handleGetJsonRates = useCallback(async () => {
        const {data, isError} = await refetchJsonRates()
        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item)=> item)
        }
        return undefined
    }, [])

    const handleGetAllRates = useCallback(async () => {
            const {data, isError} = await refetchAllRates()
            if (!isError && Array.isArray(data) && data.length) {
                return data.map((item)=> item)
            }
            return undefined
        }, [])

    const handleGetEmotionSessions = useCallback(async (): Promise<EmotionSessionI[] | undefined> => {
        const {data, isError} = await refetchEmotionSessions()
        if (!isError && Array.isArray(data) && data.length) {
            return data as unknown as EmotionSessionI[]
        }
        return undefined
    }, [])


    return {
        handleGetMainRates,
        handleGetJsonRates,
        handleGetAllRates,
        handleGetEmotionSessions
    }
}
