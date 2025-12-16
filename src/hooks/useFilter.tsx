import { useState, useEffect, useCallback, createContext, FC, ReactNode, Provider } from "react";
import { ListedData, RangeData } from "../types/app";

// ----- helpers -----
export type FilterContentValueType<T_default, T_active> = {
    default: T_default;
    active?: T_active;
};
export const FilterTypes = {
    checkbox: "checkbox",
    radio: "radio",
    range: "range",
} as const;
export type FilterType = (typeof FilterTypes)[keyof typeof FilterTypes]; // ??? why branches

export type FilterContent =
    | {
        title: string;
        type: typeof FilterTypes.checkbox;
        value: FilterContentValueType<ListedData[], ListedData[]>; // Set<string>
      }
    | {
        title: string;
        type: typeof FilterTypes.radio;
        value: FilterContentValueType<ListedData[], ListedData[]>; // Set<string>
      }
    | {
        title: string;
        type: typeof FilterTypes.range;
        value: FilterContentValueType<RangeData, RangeData>;
      };

export function isOfFilterType<T extends FilterContent["type"]>(
    obj: FilterContent,
    type: T
): obj is Extract<FilterContent, { type: T }> {
    return obj.type === type;
}
// ----- ------- -----

export interface FilterOutType {
    filterStr: string;
    filterContent: Record<string, FilterContent>;
    setActiveValue: (filterName: string, valType: FilterType, value: FilterContent["value"]["active"]) => void;
};
export interface FilterArgs {
    content: Record<string, FilterContent>; //or if export type FilterTypesValues = [string[], {from: number, to: number}, string[]] -> value: FilterTypesValues[number] 
    initialString: string;
};// or [key: string]FilterContent

export function useFilter( { content, initialString }: FilterArgs ): FilterOutType {
    if (!content) return {} as FilterOutType;
    const [filterStr, setFilterStr] = useState<string>(initialString)
    const [filterContent, setFilterContent] = useState<FilterArgs["content"]>(content);
    
    const serializeFilterData = useCallback((data: FilterArgs["content"]) => {
        const filterStr: string[] = [];
        Object.entries(data).forEach(([filterName, filterValue]) => {
            if (filterValue.value.active) {
                let enumStr = "";
                if (
                    filterValue.type === FilterTypes.checkbox ||
                    filterValue.type === FilterTypes.radio
                ) {
                    const names = filterValue.value.active.map(i => i.name)
                    enumStr = names.join(",");
                } else if (filterValue.type === FilterTypes.range) {
                    enumStr = `${filterValue.value.active.min ? filterValue.value.active.min : "min"}_${filterValue.value.active.max ? filterValue.value.active.max : "max"}`;
                }
                filterStr.push(`${filterName}[${filterValue.type}]:${enumStr.length > 0 ? enumStr : null}`);
            } else {
                return;
            }
        });
        return filterStr.join(";");
    }, []);

    const setActiveValue = useCallback(
        (
            filterName: string,
            valType: FilterType,
            value: FilterContent["value"]["active"]
        ) => {
            setFilterContent((f) => {
                const filter = f[filterName];
                if (filter && filter.type === valType) {
                    return {
                        ...f,
                        [filterName]: {
                            ...filter,
                            value: {
                                ...filter.value,
                                active: value,
                            },
                        } as FilterContent,
                    };
                }
                return f;
            });
        },
        []
    );

    useEffect(() => {
        setFilterStr(serializeFilterData(filterContent));
    }, [filterContent])

    const outputValue: FilterOutType = {
        filterStr,
        filterContent,
        setActiveValue,
    };
    return outputValue;
}


// import { useContext } from "react"
// import { FilterContext } from "../contexts/FilterContext"

// export const useFilter = () => {
//     const context = useContext(FilterContext)
//     if (!context) throw new Error("useFilter must be used within a FilterProvider");
//     return context;
// }