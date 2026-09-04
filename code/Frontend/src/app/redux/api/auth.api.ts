import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

import {API_BASE_URL, AUTH_LOGOUT_PATH, AUTH_PATH, AUTH_SIGNIN_PATH} from "@/app/redux/api/endpoints";
import {SignInData} from "@/shared";

interface CheckUserResponse {
    exists: boolean
}



export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders(headers) {
            return headers
        },
        credentials: 'include',
    }),
    endpoints: build => ({
        signin: build.mutation<void, SignInData | URLSearchParams>({
            query: (body: URLSearchParams) => ({
                url: AUTH_SIGNIN_PATH,
                method: 'POST',
                body: new URLSearchParams(body),
            }),
        }),
        logout: build.mutation<void, void>({
            query: () => ({
                url: AUTH_LOGOUT_PATH,
                method: 'POST',
                responseHandler: 'text',
            }),
        }),
        checkUsername: build.query<CheckUserResponse, string>({
            query: (username: string) => ({
                url: `${AUTH_PATH}/check-user?username=${encodeURIComponent(username)}`,
            }),
        }),
    }),
})

export const {
    useLazyCheckUsernameQuery,
    useSigninMutation,
    useLogoutMutation,
} = authApi
