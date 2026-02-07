import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchShopItems, purchaseItem } from "../../services/api-actions";
import { IShopItem } from "../../types/app";
import { ShopQueryParams } from "../../components/Shop/Shop";
import { useAppSelector } from "../../hooks";
import { Namespace } from "../../consts";

export interface ShopItemState {
    shopItems: IShopItem[];
    count: number;
    total: number;
    query?: ShopQueryParams;
    isLoading: boolean;
    error: string | null;
}

const initialState: ShopItemState = {
    shopItems: [],
    count: 0,
    total: 0,
    query: undefined,
    isLoading: false,
    error: null,
};

export const shopSlice = createSlice({
    name: "shopItems",
    initialState: initialState,
    reducers: {
        resetShopItems: (state) => {
            state = initialState;
        },
        setShopItems: (state, action: PayloadAction<IShopItem[]>) => {
            // PayloadAction<IShopItem[]> or { payload: IShopItem[] }
            state.shopItems = action.payload;
        },
        pushShopItems: (state, action: PayloadAction<IShopItem[]>) => {
            // duplicate of builder fullfilled case (but locally)
            state.shopItems = state.shopItems.concat(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShopItems.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.query = action.meta.arg;
            })
            .addCase(fetchShopItems.fulfilled, (state, action) => {
                state.isLoading = false;
                const { items, total, isReset } = action.payload;
                if (isReset) {
                    state.shopItems = items;
                    state.count = action.meta.arg?.limit || total
                } else {
                    state.shopItems.push(...action.payload.items); //state.shopItems = state.shopItems.concat(action.payload.items);
                    state.count += action.meta.arg?.limit || total
                }
                state.total = total;
            })
            .addCase(fetchShopItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(purchaseItem.fulfilled, (state) => {
                // можно добавить обновление баланса извне или уведомление
            });
    },
});
export const { setShopItems, pushShopItems, resetShopItems } =
    shopSlice.actions;

export const getShop = () => useAppSelector(state => state[Namespace.shop]);

export default shopSlice.reducer;
