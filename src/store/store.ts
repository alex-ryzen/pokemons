import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '../services/baseApi'
import { authProcess } from './auth-process/auth-process'
import { Namespace } from '../consts'
import { errorLoggerMiddleware } from '../services/error-middleware'

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [Namespace.Auth]: authProcess.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            baseApi.middleware,
            errorLoggerMiddleware
        )
})  


export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>


export type AppThunk<ThunkReturnType = void> = ThunkAction< // Define a reusable type describing thunk functions
  ThunkReturnType,
  RootState,
  unknown,
  Action
>

