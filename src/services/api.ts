import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../types/app";
import { toast } from "react-toastify";

export type AuthResponse = {
    accessToken: string,
    user: IUser
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

const StatusCodeMapping: Record<number, boolean> = {
    [StatusCodes.OK]: false,
    [StatusCodes.INTERNAL_SERVER_ERROR]: true,
    [StatusCodes.NOT_FOUND]: true,
    [StatusCodes.UNAUTHORIZED]: true,
    [StatusCodes.UNPROCESSABLE_ENTITY]: true,
    [StatusCodes.FORBIDDEN]: true,
    [StatusCodes.BAD_REQUEST]: true,
};

const isError = (response: AxiosResponse) =>
    StatusCodeMapping[response.status];

type DetailMessageType = {
    type: string;
    message: string;
};

export const createAPI = (): AxiosInstance => {
    const api = axios.create({
        baseURL: BACKEND_URL
    })

    let isRefreshing = false;
    let failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (reason?: any) => void;
    }> = [];

    const processQueue = (error: any, token: string | null = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config;
    })

    api.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError<DetailMessageType>) => {
            const originalRequest = error.config;
            if (originalRequest && error.response?.status === 401 && !originalRequest.data._isRetry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return api.request(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }
                originalRequest.data._isRetry = true;
                isRefreshing = true;
                try {
                    const response = await axios.get<AuthResponse>(`${BACKEND_URL}/refresh-token`, { withCredentials: true });
                    const newToken = response.data.accessToken;
                    localStorage.setItem('token', newToken);
                    processQueue(null, newToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return api.request(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    console.log('- - - unauthorized - - -');
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }
            else if (error.response && isError(error.response)) {
                const detailMessage = error.response.data;
                toast.warn(detailMessage.message);
            }

            return Promise.reject(error);
        }
    );

    return api;
}