import {useCallback} from "react";

import {UserI} from "@/shared/types/userEditorI";


export const useGetUserByIdHook = () => {

    const handleGetUserById = useCallback(async (refetch: any): Promise<UserI | undefined> => {
        const { data, isError } = await refetch();
        if (!isError) {
            return data
        }
        return undefined;
    }, []);

    
    return {
        handleGetUserById,
    }
}