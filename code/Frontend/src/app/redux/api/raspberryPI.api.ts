import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

import {API_BASE_URL, RPI_PATH} from "@/app/redux";
import {PatchRPII, PostRPII} from "@/shared/types/api/raspberryPIApi";



export const raspberryPIApi = createApi({
    reducerPath : "raspberryPIApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders(headers){
            return headers
        },
        credentials: "include"
    }),
    endpoints: build => ({
        getRpi: build.query<void, number>({
            query: (count: number) => ({
                url: `${RPI_PATH}?count=${count}`
            })
        }),
        postRpi: build.mutation<void, PostRPII>({
            query: (body: PostRPII) => ({
                url: RPI_PATH,
                method: "POST",
                body: body
            })
        }),
        patchRpi: build.mutation<void,PatchRPII>({
            query: (body: PatchRPII) => ({
                url: RPI_PATH,
                method: "PATCH",
                body: body
            })
        }),
        deleteRpi: build.mutation<void,number>({
            query: (id: number)=> ({
                url: `${RPI_PATH}?id_rpi=${id}`,
                method: "DELETE"
            })
        })
    })
})

export const {
    useGetRpiQuery,
    usePostRpiMutation,
    usePatchRpiMutation,
    useDeleteRpiMutation
} = raspberryPIApi