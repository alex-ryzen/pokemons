import { useContext } from "react";
import { GridActionsCTX, GridStateCTX } from "../contexts/GridContext";

export const useGridActions = () => {
    const context = useContext(GridActionsCTX);
    if (!context) throw new Error("useGridActions must be used within GridProvider");
    return context;
};

export const useGridState = () => {
    const context = useContext(GridStateCTX);
    if (!context) throw new Error("useGridState must be used within GridProvider");
    return context;
};

// export const useGrid = () => {
//     const context = useContext(GridContext);
//     if (!context) {
//         throw new Error("useGrid must be used within a GridProvider");
//     }
//     return context;
// };  