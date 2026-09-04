import { useCallback } from 'react';

import { JsonTableI, MainTableI } from '@/shared/types/monitoring';

export const useMonitoring = () => {
    const handleGetTable = useCallback(async (refetch: any): Promise<MainTableI[] | JsonTableI[] | undefined> => {
        const { data, isError } = await refetch();
        if (!isError && Array.isArray(data) && data.length) {
            return data.map((item) => item);
        }
        return undefined;
    }, []);

    return {
        handleGetTable
    };
};
