import { createSlice } from "@reduxjs/toolkit";
import { IBerry, IGarden, IGardenService } from "../../types/app";

export interface GardenState {
    garden: IGarden | null;
    items: IBerry[];
    gardenServices: IGardenService[];
    isLoading: boolean;
    error: string | null;
}

const initialState: GardenState = {
    garden: null,
    items: [],
    gardenServices: [],
    isLoading: false,
    error: null,
};

export const gardenSlice = createSlice({
    name: "garden",
    initialState: initialState,
    reducers: {

    }
});

export default gardenSlice.reducer