import { logOut, setToken } from "../store/auth-process/auth-process";
import { AuthResponse, LoginData, RegisterData, UserResponse } from "../types/app";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginData>({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setToken(data.accessToken));
                    localStorage.setItem("accessToken", data.accessToken);
                } catch (e) {
                    //
                }
            }
        }),
        register: builder.mutation<AuthResponse, RegisterData>({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setToken(data.accessToken));
                    localStorage.setItem("accessToken", data.accessToken);
                } catch (e) {
                    //
                }
            }
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'DELETE',
            }),
            async onQueryStarted(_arg, {dispatch}) {
                try {
                    dispatch(logOut())
                } catch (e) {
                    //
                }
            }
        }),
        getUserData: builder.query<UserResponse, void>({
            query: () => ({
                url: '/user/data',
                method: 'GET',
            }),
            providesTags: ['User', 'Player'],
        })
    })
})

export const {
    useGetUserDataQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
} = userApi;