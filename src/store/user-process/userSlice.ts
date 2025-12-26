import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlayer, IUser, UserRoles } from "../../types/app";
import { fetchUserData, loginUser, registerUser } from "../../services/api-actions";

interface UserState { // and PlayerState (2 in 1)
    user: IUser | null;
    player: IPlayer | null;
    isLoading: boolean;
    isFileUploading: boolean;
    isAuth: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    player: null,
    isLoading: false,
    isFileUploading: false,
    isAuth: !!localStorage.getItem('accessToken'),
    error: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload;
        },
        setRole: (state, action: PayloadAction<UserRoles>) => {
            if (state.user) state.user.role = action.payload;
        },
        logout: (state) => {
            console.log("LOGGING OUT")
            localStorage.removeItem('accessToken');
            state.isAuth = false;
            state.user = null;
            state.player = null;
        },
        // reducers for sagas
        updateProfileSuccess: (state, action: PayloadAction<Partial<IUser>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
            state.isLoading = false;
        },
        setFileUploading: (state, action: PayloadAction<boolean>) => {
            state.isFileUploading = action.payload;
        },
        updateAvatarSuccess: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.image = action.payload;
            }
            state.isFileUploading = false;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
            state.isFileUploading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuth = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuth = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchUserData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.player = action.payload.player;
                console.log("STATE: ", state.user, state.player)
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

    }
})

export const { setIsAuth, setRole, logout,
    updateProfileSuccess, setFileUploading, updateAvatarSuccess, setError 
} = userSlice.actions;
export default userSlice.reducer;