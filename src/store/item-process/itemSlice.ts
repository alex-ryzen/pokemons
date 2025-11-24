import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchShopItems, purchaseItem } from "../../services/api-actions";
import { IItem, IShopItem } from "../../types/app";
import { UniqueIdentifier } from "@dnd-kit/core";

export type ItemCellPos = Pick<IItem, "cPosX" | "cPosY" | "gridId">;

export interface ItemState {
    items: IItem[];
    shopItems: IShopItem[];
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
    name: "items",
    initialState: initialState,
    reducers: {
        setInventoryItems: (state, action: { payload: IItem[] }) => {
            state.items = action.payload;
        },
        setShopItems: (state, action: { payload: IShopItem[] }) => {
            state.shopItems = action.payload;
        },
        setItems: (state, action: PayloadAction<IItem[]>) => {
            state.items = [...action.payload];
        },
        setPosition: (
            state,
            action: PayloadAction<{ id: IItem["id"]; pos: ItemCellPos }>
        ) => {
            if (!state.items) return;
            const currentItem = state.items.find((i) => i.id === action.payload.id);
            if (currentItem) {
                //console.log(action.payload.pos.cPosX, action.payload.pos.cPosY);
                currentItem.cPosX = action.payload.pos.cPosX;
                currentItem.cPosY = action.payload.pos.cPosY;
                currentItem.gridId = action.payload.pos.gridId;
            }
            //console.log(JSON.stringify(state.items));
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
export const { setShopItems, setItems, setPosition } = itemSlice.actions;

export default itemSlice.reducer;
