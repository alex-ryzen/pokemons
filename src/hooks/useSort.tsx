import { useState, useCallback, useEffect } from "react";

export type SortOrder = "asc" | "desc";

export type SortOption = {
    optionName: string,
    optionLabel: string
}

export interface SortData {
    sortOption: SortOption;
    sortOrderBy: SortOrder;
}

export interface SortArgs {
    initialSort: SortData,
}

export function useSort({initialSort}: SortArgs) {
    const [sortStr, setSortStr] = useState<string>()
    const [sortData, setSortData] = useState<SortData>(initialSort);

    const setSortOption =
        (optionName: SortOption["optionName"]) => {
            setSortData((prev) => {
                return  { ...prev, sortOption: {...prev.sortOption, optionName} };
            });
        }

    const toggleSortOrder = 
        () => {
            setSortData((prev) => {
                const newOrder: SortOrder = prev.sortOrderBy === "asc" ? "desc" : "asc";
                return { ...prev, sortOrderBy: newOrder };
            });
        }

    useEffect(() => {
        setSortStr(`${sortData.sortOption.optionName}-${sortData.sortOrderBy}`)
    }, [sortData])

    return { sortStr, sortData, setSortOption, toggleSortOrder };
}
