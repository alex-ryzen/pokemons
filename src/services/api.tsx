import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../consts";
import { ErrorResponse } from "./api-actions";
import { logout } from "../store/user-process/userSlice";
import { AppDispatch } from "../store/store";

export type AuthResponse = {
    accessToken: string;
};

const StatusCodeMapping: Record<number, boolean> = {
    [StatusCodes.OK]: false,
    [StatusCodes.INTERNAL_SERVER_ERROR]: true,
    [StatusCodes.NOT_FOUND]: true,
    [StatusCodes.UNAUTHORIZED]: true,
    [StatusCodes.UNPROCESSABLE_ENTITY]: true,
    [StatusCodes.FORBIDDEN]: true,
    [StatusCodes.BAD_REQUEST]: true,
};

const isError = (response: AxiosResponse) => StatusCodeMapping[response.status];

type RetryConfig = InternalAxiosRequestConfig & { _isRetry?: boolean };

let dispatch: AppDispatch;
export const injectDispatch = (app_dispatch: AppDispatch) => {
    dispatch = app_dispatch;
};

export const createAPI = (): AxiosInstance => {
    const api = axios.create({
        baseURL: BACKEND_URL,
        withCredentials: true,
    });

    let isRefreshing = false;
    let failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (reason?: any) => void;
    }> = [];

    const processQueue = (error: any, token: string | null = null) => {
        failedQueue.forEach((promise) => {
            if (error) {
                promise.reject(error);
            } else {
                promise.resolve(token);
            }
        });
        failedQueue = [];
    };

    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    });

    const isAuthRoute = (url?: string) =>
        !!url &&
        (url.includes("/auth/login") ||
            url.includes("/auth/register") ||
            url.includes("/auth/refresh-token"));

    api.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError<ErrorResponse>) => {
            const originalRequest = error.config as RetryConfig | undefined;
            if (
                originalRequest &&
                error.response?.status === 401 &&
                !originalRequest._isRetry &&
                !isAuthRoute(originalRequest.url)
            ) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers[
                                "Authorization"
                            ] = `Bearer ${token}`;
                            return api.request(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }
                originalRequest._isRetry = true;
                isRefreshing = true;
                try {
                    const response = await api.patch<AuthResponse>(
                        `${BACKEND_URL}/auth/refresh-token`
                    );
                    const newToken = response.data.accessToken;
                    localStorage.setItem("accessToken", newToken);
                    processQueue(null, newToken);
                    originalRequest.headers[
                        "Authorization"
                    ] = `Bearer ${newToken}`;
                    return api.request(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    console.log("- - - unauthorized - - -");
                    dispatch(logout())
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            } else if (error.response && isError(error.response)) {
                const data = error.response.data;
                if (data?.errors?.length) {
                    toast.warn(
                        <div>
                            <div>{data.message}</div>
                            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                                {data.errors.map((e, i) => (
                                    <li key={`${e.path}-${i}`}>
                                        {/* {e.path ? `${e.path}: ` : ""} */}
                                        {e.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                } else if (data?.message) {
                    toast.warn(data.message);
                }
            }

            return Promise.reject(error);
        }
    );

    return api;
};
