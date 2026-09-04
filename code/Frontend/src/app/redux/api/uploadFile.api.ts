import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

import {API_BASE_URL, FILE_PATH} from "@/app/redux";



export const uploadFileApi = createApi({
    reducerPath: "roleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders(headers) {
            return headers
        },
        credentials: 'include'
    }),
    endpoints: build => ({
        uploadFile: build.mutation<void, FormData>({
            query: (body: FormData) => ({
                url: `${FILE_PATH}`,
                method: "POST",
                body: body
            })
        }),
    })
})

export const {
    useUploadFileMutation
} = uploadFileApi