import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { BACKEND_URL } from "../consts";
import { RootState } from "../store/store";
import { AuthResponse } from "../types/app";
import { logOut, setToken } from "../store/auth-process/auth-process";

const mutex = new Mutex();

const baseQueryAuthed: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const baseQueryInstance = fetchBaseQuery({
        baseUrl: BACKEND_URL,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    });
    await mutex.waitForUnlock();
    let result = await baseQueryInstance(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQueryInstance(
                    {
                        url: "/auth/refreshToken",
                        method: "PATCH",
                    },
                    api,
                    extraOptions,
                );
                if (refreshResult.data) {
                    const data = refreshResult.data as AuthResponse;
                    api.dispatch(setToken(data.accessToken));
                    localStorage.setItem("accessToken", data.accessToken);
                    result = await baseQueryInstance(args, api, extraOptions)
                } else {
                    console.warn("Refresh token expired. Logging out...");
                    api.dispatch(logOut());
                };
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQueryInstance(args, api, extraOptions);
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryAuthed,
    tagTypes: [
        "User",
        "Player",
        "Inventory",
        "Pokemons",
        "Shop",
        "Garden",
        "GardenItem",
        "GardenService",
        "Hunt",
    ],
    endpoints: () => ({}),
});
