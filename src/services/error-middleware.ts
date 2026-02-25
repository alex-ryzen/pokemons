import { isRejectedWithValue, Middleware} from "@reduxjs/toolkit";
import { ErrorResponse } from "../types/app";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function isErrorResponse(error: unknown): error is ErrorResponse {
    return typeof error === 'object' && error !== null && 'status' in error;
}

export const errorLoggerMiddleware: Middleware = (_api) => (next) => (action) => {
    //console.log("AUTHed: ", store.getState().auth.isAuth);
    if (isRejectedWithValue(action)) {
        const payload = action.payload as ErrorResponse;
        if (isErrorResponse(payload)) {
            console.error(`ERROR: ${JSON.stringify(payload)}`)
            if (payload.data) {
                toast.error(`ERROR: ${payload.status}\n${payload.data.message}\n${payload.data.errors ? JSON.stringify(payload.data.errors) : ''}`, {
                    toastId: action.meta.requestId
                })
            } else if ((payload as FetchBaseQueryError).status === "FETCH_ERROR") {
                toast.error(`connection error :(`, {
                    toastId: action.meta.requestId
                })
            } else {
                toast.error(`ERROR: ${payload.status}\n${payload.error}`, {
                    toastId: action.meta.requestId
                })
            }
        }
    }
    return next(action);
}