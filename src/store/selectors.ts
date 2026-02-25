import { createEntityAdapter, EntityAdapter } from "@reduxjs/toolkit";
import { GeneralType, IDTYPE } from "../types/app";

export const entityAdapter = <T extends GeneralType>(): EntityAdapter<T, IDTYPE> => {
    return createEntityAdapter<T, IDTYPE>({
        selectId: (item) => item.id,
        //sortComparer: (a, b) => a.id.localeCompare(b.id),
    });
};