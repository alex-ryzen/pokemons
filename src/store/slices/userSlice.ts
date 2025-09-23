import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IUser, UserStatus, UserRoles } from "../../types/app";

interface UserState {
    data: IUser | null;
    status: UserStatus;
    error: string | null;
}

const initialState: UserState = {
    data: {id: '111', username: 'prinet_pb', role: UserRoles.User, isAuth: true}, //null
    status: 'idle',
    error: null,
}

export const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers: {
        setIsAuth: (state, action: PayloadAction<boolean>) => {
            if (state.data) {
                state.data.isAuth = action.payload;
            }
        },
        setRole: (state, action: PayloadAction<UserRoles>) => {
            if (state.data) {
                state.data.role = action.payload;
            }
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase()
    // }
})

export const {setIsAuth, setRole} = userSlice.actions;
export default userSlice.reducer;