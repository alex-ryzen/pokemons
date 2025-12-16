// import { useState, useEffect, useCallback, createContext, FC, ReactNode, Provider } from "react";
// import { ListedData, RangeData } from "../types/app";
// import { ProviderProps } from "./CTXProviderComposer";

// // ----- helpers -----
// export type FilterContentValueType<T_default, T_active> = {
//     default: T_default;
//     active?: T_active;
// };
// export const FilterTypes = {
//     checkbox: "checkbox",
//     radio: "radio",
//     range: "range",
// } as const;
// export type FilterType = (typeof FilterTypes)[keyof typeof FilterTypes]; // ??? why branches

// export type FilterContent =
//     | {
//           type: typeof FilterTypes.checkbox;
//           value: FilterContentValueType<ListedData[], Set<string>>;
//       }
//     | {
//           type: typeof FilterTypes.radio;
//           value: FilterContentValueType<ListedData[], Set<string>>;
//       }
//     | {
//           type: typeof FilterTypes.range;
//           value: FilterContentValueType<RangeData, RangeData>;
//       };

// export function isOfFilterType<T extends FilterContent["type"]>(
//     obj: FilterContent,
//     type: T
// ): obj is Extract<FilterContent, { type: T }> {
//     return obj.type === type;
// }
// // ----- ------- -----

// export interface FilterContextType {
//     filterStr: string;
//     filterContent: Record<string, FilterContent>;
//     setActiveValue: (filterName: string, valType: FilterType, value: FilterContent["value"]["active"]) => void;
// };
// export interface FilterValue {
//     content: Record<string, FilterContent>; //or if export type FilterTypesValues = [string[], {from: number, to: number}, string[]] -> value: FilterTypesValues[number] 
// };// or [key: string]FilterContent

// export const FilterContext = createContext<FilterContextType | null>(null)

// export const FilterProvider: FC<ProviderProps<FilterValue>> = ({children, value}) => {
//     if (!value) return;
//     const [filterStr, setFilterStr] = useState<string>("")
//     const [filterContent, setFilterContent] = useState<FilterValue["content"]>(value.content);
    
//     const serializeFilterData = useCallback((data: FilterValue["content"]) => {
//         const filterStr: string[] = [];
//         console.log(data)
//         Object.entries(data).forEach(([filterName, filterValue]) => {
//             if (filterValue.value.active) {
//                 let enumStr = "";
//                 if (
//                     filterValue.type === FilterTypes.checkbox ||
//                     filterValue.type === FilterTypes.radio
//                 ) {
//                     enumStr = Array.from(filterValue.value.active).join(",");
//                 } else if (filterValue.type === FilterTypes.range) {
//                     enumStr = `${filterValue.value.active.min}-${filterValue.value.active.max}`;
//                 }
//                 filterStr.push(`${filterName}[${filterValue.type}]:${enumStr}`);
//             } else {
//                 return;
//             }
//         });
//         return filterStr.join(";");
//     }, []);

//     const setActiveValue = useCallback(
//         (
//             filterName: string,
//             valType: FilterType,
//             value: FilterContent["value"]["active"]
//         ) => {
//             setFilterContent((f) => {
//                 const filter = f[filterName];
//                 if (filter && filter.type === valType) {
//                     return {
//                         ...f,
//                         [filterName]: {
//                             ...filter,
//                             value: {
//                                 ...filter.value,
//                                 active: value,
//                             },
//                         } as FilterContent,
//                     };
//                 }
//                 return f;
//             });
//         },
//         []
//     );

//     useEffect(() => {
//         setFilterStr(serializeFilterData(filterContent));
//     }, [filterContent])

//     const outputValue: FilterContextType = {
//         filterStr,
//         filterContent,
//         setActiveValue,
//     };
//     return (
//         <FilterContext.Provider value={outputValue}>
//             {children}
//         </FilterContext.Provider>
//     );
// }
