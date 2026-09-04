import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

import {
    API_BASE_URL, DATA,
    EMOTION_SESSIONS,
    MONITORING_JSON,
    MONITORING_MAIN_TABLE,
} from "@/app/redux/api/endpoints";
import {MonitoringQueryI} from "@/shared/types/api/monitoring";

interface dates {
    date_from: string,
    date_to: string
}

export const monitoringApi = createApi({
    reducerPath: 'monitoringApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders(headers) {
            return headers
        },
        credentials: 'include',
    }),
    endpoints: build => ({
        getMainTable: build.query<void, MonitoringQueryI>({
            query: (query: MonitoringQueryI) => ({
                url: query.date_from && query.date_to
                    ? `${MONITORING_MAIN_TABLE}?count=${query.count}&date_from=${query.date_from}&date_to=${query.date_to}`
                    : `${MONITORING_MAIN_TABLE}?count=${query.count}`,
            }),
        }),
        getJson: build.query<void, MonitoringQueryI>({
            query: (query: MonitoringQueryI) => ({
                url: query.date_from && query.date_to
                    ? `${MONITORING_JSON}?count=${query.count}&date_from=${query.date_from}&date_to=${query.date_to}`
                    : `${MONITORING_JSON}?count=${query.count}`,
            }),
        }),
        getMainTableRates: build.query<void, dates>({
            query: (query: dates) => ({
                url: query.date_from && query.date_to
                    ? `${DATA}/countMainTable?date_from=${query.date_from}&date_to=${query.date_to}`
                    : `${DATA}/countMainTable`,
            }),
        }),
        getJsonTableRates: build.query<void, dates>({
            query: (query: dates) => ({
                url: query.date_from && query.date_to
                    ? `${DATA}/countJsonTable?date_from=${query.date_from}&date_to=${query.date_to}`
                    : `${DATA}/countJsonTable`,
            }),
        }),
        getAllTableRates: build.query<void, dates>({
            query: (query: dates) => ({
                url: query.date_from && query.date_to
                    ? `${DATA}/countAll?date_from=${query.date_from}&date_to=${query.date_to}`
                    : `${DATA}/countAll`,
            }),
        }),
        getEmotionSessions: build.query<void, dates>({
            query: (query: dates) => ({
                url: query.date_from && query.date_to
                    ? `${EMOTION_SESSIONS}?count=1&date_from=${query.date_from}&date_to=${query.date_to}`
                    : `${EMOTION_SESSIONS}?count=1`,
            }),
        }),
    }),
})

export const {
    useGetMainTableQuery,
    useGetJsonQuery,
    useGetMainTableRatesQuery,
    useGetJsonTableRatesQuery,
    useGetAllTableRatesQuery,
    useGetEmotionSessionsQuery
} = monitoringApi
