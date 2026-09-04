import {useCallback} from "react";

import {useGetShiftQuery} from "@/app/redux";
import {QueryI} from "@/hooks/useGetMonitoringQuery";
import {ShiftEditorI} from "@/shared/types/api/shiftEditorApi/shiftEditorApi";


export const useShiftEditor = (query: QueryI) => {
    const {refetch: refetchShift} = useGetShiftQuery({
        date_from: query.date_from,
        date_to: query.date_to,
        count: query.count
    })
    
    const handleGetShift = useCallback(async (): Promise<ShiftEditorI[] | undefined> => {
        const {data, isError} = await refetchShift()
        
        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item)=> item)
        }
        return undefined
    }, [refetchShift])



    
    return {handleGetShift}
}