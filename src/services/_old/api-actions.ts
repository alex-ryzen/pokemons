// api-actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance, AxiosError } from 'axios';
import { IPlayer, IUser, IPokemon, IShopItem, RegisterData, LoginData } from '../types/app';
import { AuthResponse } from './api.tsx';
import { AppDispatch, RootState } from '../store/store';
import { ShopQueryParams } from '../components/Shop/Shop';
import { sleep } from '../utils/functions';
import { logout } from '../store/user-process/userSlice.ts';


export type ErrorResponse = {
    message?: string;
    errors?: { path: string; message: string; code?: string }[];
};

interface ThunkApiConfig {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
    rejectValue: ErrorResponse;
}

// api actions

export const registerUser = createAsyncThunk<
    AuthResponse,
    RegisterData,
    ThunkApiConfig
>('auth/register', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.post<AuthResponse>('/auth/register', data);
        localStorage.setItem('accessToken', response.data.accessToken);
        console.log(response.data)
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: 'Registration error'});
    }
});

export const loginUser = createAsyncThunk<
    AuthResponse,
    LoginData,
    ThunkApiConfig
>('auth/login', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', data);
        localStorage.setItem('accessToken', response.data.accessToken);
        console.log(response.data)
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: 'Login error'});
    }
});

export const logoutUser = createAsyncThunk<
    void,
    void,
    ThunkApiConfig
>('auth/logout', async (_, { extra: api, dispatch, rejectWithValue }) => {
    try {
        await api.delete('/auth/logout'); 
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: "Logout request failed, but clearing local data anyway"});
    } finally {
        dispatch(logout())
    }
});

interface UserData {user: IUser, player: IPlayer}
export const fetchUserData = createAsyncThunk<
    UserData,
    void,
    ThunkApiConfig
>('user/fetchUserData', async (_, { extra: api, rejectWithValue}) => {
    try {
        const response = await api.get<UserData>('/user/data');
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: 'Getting user\'s info error...'});
    }
});


export const fetchBalance = createAsyncThunk<
    number | string,
    void,
    ThunkApiConfig
>('user/fetchBalance', async (_, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.get<number | string>('/user/balance');
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: 'Failed to get balance'});
    }
});


export type UserPokemons = {
    pokemons: IPokemon[]
}
export const fetchUserPokemons = createAsyncThunk<
    UserPokemons,
    void,
    ThunkApiConfig
>('user/fetchPokemons', async (_, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.get('/user/pokemons');
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: 'Failed to load pokemons'});
    }
});

export type ShopItems = {
    items: IShopItem[];
    total: number;
    isReset: boolean;
}
export const fetchShopItems = createAsyncThunk<
    ShopItems,
    ShopQueryParams | undefined,
    ThunkApiConfig
>('shop/fetchItems', async (params, {dispatch, getState, extra: api, rejectWithValue }) => {
    try {
        await sleep(1500);
        const state = getState() as RootState;
        const prev = state.shop.query;
        const isReset = prev?.filter !== params?.filter || prev?.sort !== params?.sort || prev?.search !== params?.search || params?.offset === 0;
        console.log("prev: ", prev, "new: ", params, isReset)
        const response = await api.get<ShopItems>('/shop/items', { params });
        //dispatch(pushShopItems(response.data))
        response.data.isReset = isReset
        return await response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: 'Shop load error'});
    }
});


export const purchaseItem = createAsyncThunk<
    { success: boolean; newBalance: number },
    { itemId: string; quantity?: number },
    ThunkApiConfig
>('shop/purchaseItem', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.post('/shop/purchase', data);
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: 'Purchase failed'});
    }
});

export const plantSeed = createAsyncThunk<
    { success: boolean; plantId: string },
    { inventoryItemId: string; gardenSlotId: string },
    ThunkApiConfig
>('garden/plantSeed', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.post('/garden/plant', data);
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: 'Planting failed'});
    }
});

export const cancelPlant = createAsyncThunk<
    { success: boolean },
    { plantId: string },
    ThunkApiConfig
>('garden/cancelPlant', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.post('/garden/cancel', data);
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return rejectWithValue(error.response?.data ?? {message: 'Cancel failed'});
    }
});

export const syncGrowthTimers = createAsyncThunk<
    { plants: any[] },
    { gardenPlantIds: string[] },
    ThunkApiConfig
>('garden/syncTimers', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.post('/garden/sync-growth', data);
        return response.data;
    } catch (err) {
        return rejectWithValue({message: 'Sync failed'});
    }
});

export const buyGardenOption = createAsyncThunk<
    { success: boolean },
    { optionId: string },
    ThunkApiConfig
>('garden/buyOption', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.post('/garden/buy-option', data);
        return response.data;
    } catch {
        return rejectWithValue({message: 'Garden option purchase failed'});
    }
});

export const feedPokemon = createAsyncThunk<
    { hunger: number },
    { pokemonId: string; itemId: string },
    ThunkApiConfig
>('pokemon/feed', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.post('/pokemon/feed', data);
        return response.data;
    } catch {
        return rejectWithValue({message: 'Feed failed'});
    }
});

export const deletePokemon = createAsyncThunk<
    { success: boolean },
    { pokemonId: string },
    ThunkApiConfig
>('pokemon/delete', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.delete('/pokemon/delete', { data });
        return response.data;
    } catch {
        return rejectWithValue({message: 'Delete failed'});
    }
});

export const renamePokemon = createAsyncThunk<
    { success: boolean; newName: string },
    { pokemonId: string; newName: string },
    ThunkApiConfig
>('pokemon/rename', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.patch('/pokemon/rename', data);
        return response.data;
    } catch {
        return rejectWithValue({message: 'Rename failed'});
    }
});

export const buyInventoryExtension = createAsyncThunk<
    { success: boolean; newSlotsTotal: number },
    { slots: number },
    ThunkApiConfig
>('inventory/buyExtension', async (data, { extra: api, rejectWithValue }) => {
    try {
        const response = await api.post('/inventory/buy-extension', data);
        return response.data;
    } catch {
        return rejectWithValue({message: 'Inventory extension failed'});
    }
});

export const fetchUserComposite = createAsyncThunk<
    { user: IUser; balance: number; pokemons: any[]; inventory: any[] },
    void,
    ThunkApiConfig
>('user/fetchComposite', async (_, { extra: api, rejectWithValue }) => {
    try {
        const [user, balance, pokemons, inventory] = await Promise.all([
            api.get('/user/profile'),
            api.get('/user/balance'),
            api.get('/user/pokemons'),
            api.get('/user/inventory'),
        ]);
        return {
            user: user.data,
            balance: balance.data.balance,
            pokemons: pokemons.data,
            inventory: inventory.data,
        };
    } catch {
        return rejectWithValue({message: 'Composite user fetch failed'});
    }
});
