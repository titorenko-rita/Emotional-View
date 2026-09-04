import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

import {API_BASE_URL, GROUP_PATH} from "@/app/redux";
import {PatchGroupI, PostGroupI} from "@/shared/types/api/groupApi";



export const groupApi = createApi({
    reducerPath: "groupApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders(headers){
            return headers
        },
        credentials: 'include'
    }),
    endpoints: build => ({
        getGroup: build.query<void, number>({
            query: (count: number)=> ({
                url: `${GROUP_PATH}/?count=${count}`
            })
        }),
        postGroup: build.mutation<void,PostGroupI>({
            query: (body: PostGroupI) => ({
                url: GROUP_PATH,
                method: "POST",
                body: body
            })
        }),
        patchGroup: build.mutation<void,PatchGroupI>({
            query: (body: PatchGroupI) => ({
                url: GROUP_PATH,
                method: "PATCH",
                body: body
            })
        }),
        deleteGroup: build.mutation<void, number>({
            query: (id: number)=> ({
                url: `${GROUP_PATH}/?id_group=${id}`,
                method: "DELETE",
            })
        })
    })
})

export const {
    useGetGroupQuery,
    usePostGroupMutation,
    usePatchGroupMutation,
    useDeleteGroupMutation
} = groupApi