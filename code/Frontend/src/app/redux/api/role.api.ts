import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

import {API_BASE_URL, ROLE_PATH} from "@/app/redux";
import {PatchRoleI, PostRoleI} from "@/shared/types/api/roleApi";



export const roleApi = createApi({
    reducerPath: "roleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders(headers) {
            return headers
        },
        credentials: 'include'
    }),
    endpoints: build => ({
        getRole: build.query<void, number>({
            query: (number: number) => ({
                url: `${ROLE_PATH}/?count=${number}`
            })
        }),
        postRole: build.mutation<void, PostRoleI>({
            query: (body: PostRoleI)=> ({
                url: ROLE_PATH,
                method: "POST",
                body: body,
            })
        }),
        patchRole: build.mutation<void,PatchRoleI>({
            query: (body: PatchRoleI) => ({
                url: ROLE_PATH,
                method: "PATCH",
                body: body
            })
        }),
        deleteRole: build.mutation<void, number>({
            query: (id: number) => ({
                url: `${ROLE_PATH}/?id_role=${id}`,
                method: "DELETE",
            })
        })
    })
})

export const {
    useGetRoleQuery,
    usePostRoleMutation,
    usePatchRoleMutation,
    useDeleteRoleMutation
} = roleApi