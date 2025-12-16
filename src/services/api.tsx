import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../types/app";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../consts";
import { ErrorResponse } from "./api-actions";

export type AuthResponse = {
    accessToken: string;
    user: IUser;
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
        failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
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
                    const response = await axios.get<AuthResponse>(
                        `${BACKEND_URL}/auth/refresh-token`
                    );
                    const newToken = response.data.accessToken;
                    localStorage.setItem("token", newToken);
                    processQueue(null, newToken);
                    originalRequest.headers[
                        "Authorization"
                    ] = `Bearer ${newToken}`;
                    return api.request(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    console.log("- - - unauthorized - - -");
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
                } else {
                    toast.warn("Unknown error");
                }
            }

            return Promise.reject(error);
        }
    );

    return api;
};
