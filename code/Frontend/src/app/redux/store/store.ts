import {combineReducers, configureStore} from "@reduxjs/toolkit";

import {authApi, monitoringApi, shiftEditorApi,} from "@/app/redux";
import {groupApi} from "@/app/redux/api/group.api";
import {raspberryPIApi} from "@/app/redux/api/raspberryPI.api";
import {roleApi} from "@/app/redux/api/role.api";
import {usersApi} from "@/app/redux/api/users.api";
import {userReducer} from "@/app/redux/store/reducers";



const rootReducer = combineReducers({
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [raspberryPIApi.reducerPath]: raspberryPIApi.reducer,
    [monitoringApi.reducerPath]: monitoringApi.reducer,
    [shiftEditorApi.reducerPath]: shiftEditorApi.reducer,
})


export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware()
                .concat(authApi.middleware)
                .concat(usersApi.middleware)
                .concat(roleApi.middleware)
                .concat(groupApi.middleware)
                .concat(raspberryPIApi.middleware)
                .concat(monitoringApi.middleware)
                .concat(shiftEditorApi.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']