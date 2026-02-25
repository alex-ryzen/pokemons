import { createAction } from '@reduxjs/toolkit';
import { IUser } from '../types/app';
import { call, put, takeLatest, getContext } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { updateProfileSuccess, setFileUploading, updateAvatarSuccess, setError } from '../store/user-process/userSlice';
import { ErrorResponse } from './api-actions';

// action creators (SAGA)
export const updateProfileRequest = createAction<Partial<IUser>>('user/saga/UPDATE_PROFILE');
export const uploadAvatarRequest = createAction<File>('user/saga/UPLOAD_AVATAR');

// actions (SAGA)
function* updateProfileWorker(action: PayloadAction<Partial<IUser>>) {
    try {
        const api: AxiosInstance = yield getContext('api');
        const response: AxiosResponse<IUser> = yield call([api, api.patch], '/user/update', action.payload);
        yield put(updateProfileSuccess(response.data));
        
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        const message = err.response?.data?.message || 'Update failed';
        yield put(setError(message));
    }
}

function* uploadAvatarWorker(action: PayloadAction<File>) {
    try {
        yield put(setFileUploading(true));
        const api: AxiosInstance = yield getContext('api');

        const formData = new FormData();
        formData.append('image', action.payload);

        const response: AxiosResponse<{ url: string }> = yield call([api, api.post], '/user/avatar', formData);

        yield put(updateAvatarSuccess(response.data.url));
        
    } catch (error: any) {
        const err = error as AxiosError<ErrorResponse>;
        const message = err.response?.data?.message || 'Avatar upload failed';
        yield put(setError(message));
        yield put(setFileUploading(false));
    }
}

export function* userSaga() {
    yield takeLatest(updateProfileRequest.type, updateProfileWorker);
    yield takeLatest(uploadAvatarRequest.type, uploadAvatarWorker);
}
