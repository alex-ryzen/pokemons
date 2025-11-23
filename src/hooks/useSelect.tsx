import { useState, useCallback, useEffect } from "react";
import { ListedData } from "../types/app";

export type SelectMode = "single" | "multiple";

export interface SelectArgs {
    initialOptions: ListedData[];
}

export function useSelect({initialOptions}: SelectArgs) {
    const [activeOptions, setActiveOptions] = useState<ListedData[]>() //or just one if is single mode

    const setSortOption = useCallback(
        () => {
            
        },
        []
    );

    const nn = useCallback(() => {
        
    }, []);

    useEffect(() => {
        
    }, [])

    return { };
}
