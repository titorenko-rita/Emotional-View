import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

import {API_BASE_URL, AUTH_PATH, PROFILE_PATH, USER_PATH, USERS_PATH} from "@/app/redux/api/endpoints";
import {User} from "@/shared";
import {PatchUserI, RegisterUserI} from "@/shared/types/api/shiftEditorApi";


export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders(headers) {
            return headers
        },
        credentials: 'include',
    }),
    endpoints: build => ({
        getCurrentUser: build.query<void, void>({
            query: () => ({
                url: USER_PATH,
            }),
        }),
        patchUser: build.mutation<void, User>({
            query: (body: User) => ({
                url: USERS_PATH,
                method: 'PATCH',
                body: body,
                responseHandler: 'text',
            }),
        }),
        getUserById: build.query<void, number>({
            query: (id: number) => ({
                url: `${USERS_PATH}/${id}`,
            }),
        }),
        patchUserById: build.mutation<void, PatchUserI>({
            query: (data: PatchUserI) => ({
                url: `${USERS_PATH}/${data.id}`,
                body: data,
                method: "PATCH"
            }),
        }),
        registerUser: build.mutation<void, RegisterUserI>({
            query: (data: RegisterUserI) => ({
                url: `${AUTH_PATH}/register`,
                body: data,
                method: "POST"
            }),
        }),
        getAllUsers: build.query<void, number>({
            query: (count: number) => ({
                url: `${USERS_PATH}/all/?count=${count}`,
            }),
        }),
        deleteUserById: build.mutation<void, number>({
            query: (id: number) => ({
                url: `${USERS_PATH}/${id}`,
                method: "DELETE"
            }),
        }),
        getProfileInfo: build.query<void, void>({
            query: () => ({
                url: PROFILE_PATH,
            }),
        }),
    }),
})

export const {
    useGetCurrentUserQuery,
    usePatchUserMutation,
    useGetUserByIdQuery,
    usePatchUserByIdMutation,
    useDeleteUserByIdMutation,
    useGetProfileInfoQuery,
    useGetAllUsersQuery,
    useRegisterUserMutation
} = usersApi