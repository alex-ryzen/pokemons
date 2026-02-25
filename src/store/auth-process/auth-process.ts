import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState { // IUser and IPlayer = PlayerState (2 in 1) => in cached RTK Query data
    //data: Partial<IUser> & Partial<IPlayer> | null;
    accessToken: string | null;
    isAuth: boolean;
}

const initialState: AuthState = {
    //data: null,
    accessToken: localStorage.getItem("accessToken"),
    isAuth: false,
}

export const authProcess = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload
        },
        logOut: (state) => {
            localStorage.removeItem('accessToken');
            state.accessToken = null;
            state.isAuth = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher
    }
})

export const { 
    setIsAuth,
    setToken,
    logOut,
} = authProcess.actions;

export default authProcess.reducer;