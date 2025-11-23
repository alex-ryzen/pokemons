import { createSlice } from "@reduxjs/toolkit";
import { fetchShopItems, purchaseItem } from "../../services/api-actions";
import { Item, ShopItem } from "../../types/app";

interface ItemState {
    items: Item[];
    shopItems: ShopItem[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ItemState = {
    items: [],
    shopItems: [],
    isLoading: false,
    error: null,
};

export const itemSlice = createSlice({
    name: "item",
    initialState,
    reducers: {
        setInventoryItems: (state, action: { payload: Item[] }) => {
            state.items = action.payload;
        },
        setShopItems: (state, action: { payload: ShopItem[] }) => {
            state.shopItems = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // .addCase(fetchInventoryItems.pending, (state) => {
            //     state.isLoading = true;
            // })
            // .addCase(fetchInventoryItems.fulfilled, (state, action) => {
            //     state.isLoading = false;
            //     //state.shopItems = action.payload;
            // })
            // .addCase(fetchInventoryItems.rejected, (state, action) => {
            //     state.isLoading = false;
            //     //state.error = action.payload as string;
            // })
            // .addCase(fetchGardenItems.pending, (state) => {
            //     state.isLoading = true;
            // })
            // .addCase(fetchGardenItems.fulfilled, (state, action) => {
            //     state.isLoading = false;
            //     //state.shopItems = action.payload;
            // })
            // .addCase(fetchGardenItems.rejected, (state, action) => {
            //     state.isLoading = false;
            //     //state.error = action.payload as string;
            // })
            .addCase(fetchShopItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchShopItems.fulfilled, (state, action) => {
                state.isLoading = false;
                //state.shopItems = action.payload;
            })
            .addCase(fetchShopItems.rejected, (state, action) => {
                state.isLoading = false;
                //state.error = action.payload as string;
            })
            .addCase(purchaseItem.fulfilled, (state) => {
                // можно добавить обновление баланса извне или уведомление
            });
    },
});
export const { setShopItems } = itemSlice.actions;

export default itemSlice.reducer;
