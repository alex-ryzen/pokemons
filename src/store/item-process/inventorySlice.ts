import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IItem } from "../../types/app";

export type InvItemCellPos = Pick<IItem, "cPosX" | "cPosY" | "gridId">;

export interface InvItemState {
    items: IItem[];
    isLoading: boolean;
    error: string | null;
}

const initialState: InvItemState = {
    items: [],
    isLoading: false,
    error: null,
};

export const inventorySlice = createSlice({
    name: "inventoryItems",
    initialState: initialState,
    reducers: {
        setInventoryItems: (state, action: PayloadAction<IItem[]>) => { // PayloadAction<IItem[]> or { payload: IItem[] }
            state.items = action.payload;
        },
        setPosition: (
            state,
            action: PayloadAction<{ id: IItem["id"]; pos: InvItemCellPos }>
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
            // .addCase(fetchShopItems.pending, (state) => {
            //     state.isLoading = true;
            // })
            // .addCase(fetchShopItems.fulfilled, (state, action) => {
            //     state.isLoading = false;
            //     //state.shopItems = action.payload;
            // })
            // .addCase(fetchShopItems.rejected, (state, action) => {
            //     state.isLoading = false;
            //     //state.error = action.payload as string;
            // })
            // .addCase(purchaseItem.fulfilled, (state) => {
            //     // можно добавить обновление баланса извне или уведомление
            // });
    },
});
export const { setInventoryItems, setPosition } = inventorySlice.actions;

export default inventorySlice.reducer;
