import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

import {
    API_BASE_URL,
    SHIFT_PATH,
} from "@/app/redux/api/endpoints";
import {MonitoringQueryI} from "@/shared/types/api/monitoring";
import {
    PatchShiftEditorI,
    PostShiftEditorI
} from "@/shared/types/api/shiftEditorApi/shiftEditorApi";



export const shiftEditorApi = createApi({
    reducerPath: 'shiftEditor',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders(headers) {
            return headers
        },
        credentials: 'include',
    }),
    endpoints: build => ({
        getShift: build.query<void, MonitoringQueryI>({
            query: (query: MonitoringQueryI) => ({
                url: query.date_from && query.date_to
                    ? `${SHIFT_PATH}?count=${query.count}&date_from=${query.date_from}&date_to=${query.date_to}`
                    : `${SHIFT_PATH}?count=${query.count}`,
            }),
        }),
        postShift: build.mutation<void, PostShiftEditorI>({
            query: (body: PostShiftEditorI) => ({
                url: SHIFT_PATH,
                method: 'POST',
                body: body,
                responseHandler: 'text',
            }),
        }),
        patchShift: build.mutation<void, PatchShiftEditorI>({
            query: (body: PatchShiftEditorI) => ({
                url: SHIFT_PATH,
                method: 'PATCH',
                body: body,
                responseHandler: 'text',
            }),
        }),
        deleteShift: build.mutation<void, number>({
            query: (id: number) => ({
                url: `${SHIFT_PATH}?id_smena=${id}`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const {
    useGetShiftQuery,
    usePostShiftMutation,
    usePatchShiftMutation,
    useDeleteShiftMutation
} = shiftEditorApi