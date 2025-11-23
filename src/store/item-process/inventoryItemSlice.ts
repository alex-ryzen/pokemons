import { createSlice } from "@reduxjs/toolkit";
import { Item } from "../../types/app";


interface ItemState {
    inventoryItems: Item[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ItemState = {
    inventoryItems: [],
    isLoading: false,
    error: null,
};

export const itemSlice = createSlice({
    name: "inventoryItem",
    initialState,
    reducers: {
        posChanged(state, action: {payload: {item_id: string, cx: number, cy: number}}) {
            const currentItem = state.inventoryItems.find((invItem) => invItem.id === action.payload.item_id)
            if (currentItem) {
                currentItem.gridSpec.cPos.x = action.payload.cx
                currentItem.gridSpec.cPos.y = action.payload.cy
            }
            
        }
    },
    extraReducers: (builder) => {
        builder
    }
})