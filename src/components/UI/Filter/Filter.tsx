import { FC, useEffect, useState } from "react";
import CheckboxList from "../Checkbox/CheckboxList";
import Range from "../Input/Range";
import styles from './filter.module.css'
import { FilterArgs, FilterContent, FilterType, FilterTypes, isOfFilterType } from "../../../hooks/useFilter";

export interface FilterProps {
    filterContent: FilterArgs["content"];
    setActiveValue: (
        filterName: string,
        valType: FilterType,
        value: FilterContent["value"]["active"]
    ) => void;
}

const Filter: FC<FilterProps> = ({filterContent, setActiveValue}) => {
    return (
        <div className={styles.filterContainerWrapper}>
            <div className={styles.filterContainer}>
                {Object.keys(filterContent).map((filterName, idx) => 
                    {
                        const filter = filterContent[filterName]
                        if (filter.type === FilterTypes.checkbox) {
                            return (
                                <CheckboxList
                                    key={idx}
                                    defaultCheckboxes={ filter.value.default }
                                    activeCheckboxes={ filter.value.active }
                                    onChange={ setActiveValue.bind(null, filterName, FilterTypes.checkbox) }
                                ></CheckboxList>
                            )
                        } else if (filter.type === FilterTypes.range) {
                            return (
                                <Range 
                                    key={idx}
                                    value={filter.value.active}
                                    onChange={ setActiveValue.bind(null, filterName, FilterTypes.range)}
                                ></Range>
                            )
                        }
                    }
                )}
            </div>
        </div>
    );
}
 
export default Filter;




// export type FilterTypesValuesType =
// {
//     [FilterTypes.checkbox]: {default: ListedData[], active: ListedData[]},
//     [FilterTypes.range]: {default: RangeData, current: RangeData},
//     [FilterTypes.radio]: {default: ListedData[], active: ListedData[]},
// }

// export interface FilterProps {
//     content: Record<string, {type: FilterType, value: FilterTypesValuesType[FilterType]}> //or if export type FilterTypesValues = [string[], {from: number, to: number}, string[]] -> value: FilterTypesValues[number]
// }


    //  const [filterContent, setFilterContent] = useState<FilterProps['content']>(content);
    //  const serializeFilterData = (data: FilterProps['content']): string => {
    //     const filterStr: string[] = [];
    //     Object.entries(data).forEach(([filterName, filterValue]) => {
    //         let enumStr: string = ""
    //         if (filterValue.type === "checkbox" || filterValue.type === "radio") {
    //             enumStr = Array.from(filterValue.value.active).join(',')
    //         } else if (filterValue.type === "range") {
    //             enumStr = `${filterValue.value.active.min}-${filterValue.value.active.max}`
    //         } // and more types of filters
    //         let currSubParamStr = `${filterName}[${filterValue.type}]:${enumStr}`;
    //         filterStr.push(currSubParamStr)
    //     })
    //     return filterStr.join(';')
    // }

    // useEffect(() => {

    // }, [filterContent])

    // const setActiveValue = (filterName: string, valType: FilterType, value: FilterContent['value']['active']) => {
    //     if (isOfFilterType(filterContent[filterName], valType)) {
    //         setFilterContent({
    //             ...filterContent, 
    //             [filterName]: {
    //                 ...filterContent[filterName], 
    //                 value: {
    //                     ...filterContent[filterName].value, 
    //                     active: value
    //                 }
    //             } as FilterContent
    //         })
    //     }
    // }