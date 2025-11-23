import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IPlayer, IUser, UserRoles } from "../../types/app";
import { fetchBalance, fetchInitData, fetchUserComposite, loginUser, registerUser } from "../../services/api-actions";

interface UserState {
    user: IUser | null;
    player: IPlayer | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    player: null,
    isLoading: false,
    error: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsAuth: (state, action: PayloadAction<boolean>) => {
            if (state.user) {
                state.user.isAuth = action.payload;
            }
        },
        setRole: (state, action: PayloadAction<UserRoles>) => {
            if (state.user) {
                state.user.role = action.payload;
            }
        },
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.player = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                //localStorage.setItem('token', action.payload.accessToken);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                //localStorage.setItem('token', action.payload.accessToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchInitData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchInitData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.player = action.payload.player;
            })
            .addCase(fetchInitData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

    }
    // extraReducers: (builder) => {
    //     builder
    //         .addCase()
    // }
})

export const { setIsAuth, setRole, logout } = userSlice.actions;
export default userSlice.reducer;