import { FC, useState, useCallback, useEffect, forwardRef, RefObject, useRef } from "react";
import styles from "./filterBar.module.css";
import FilterBarOption from "./FilterBarOption";
import FilterDropdown from "./FilterDropdown";
import { useOutsideClick } from "../../../hooks/useClickOutside";
import { ListedData } from "../../../types/app";
import { FilterArgs, FilterTypes, useFilter } from "../../../hooks/useFilter";
import Filter from "./Filter";
import { mergeRefs } from "../../../utils/handlers";
import { CSSTransition } from "react-transition-group";

export interface FilterProps {
    options: FilterArgs['content'];
    filterBarName: string;
    filterInnerName: string;
    setFilter: (f: string) => void; //(options: ListedData[]) => void;
    hasApplied?: (applied: boolean) => void;
    disabled?: boolean;
    ref?: RefObject<HTMLDivElement>
}

const initialFilterStr = "product[checkbox]:null";

const FilterBar: FC<FilterProps> = forwardRef(({
    options,
    filterBarName,
    filterInnerName,
    setFilter,
    hasApplied,
    disabled
}, ref) => {
    const [open, setOpen] = useState(false);
    const rootRef = useOutsideClick<HTMLDivElement>(() => setOpen(false), open);
    const filter = useFilter({ content: options, initialString: initialFilterStr })
    const activeProducts = filter.filterContent['product'].value.active as ListedData[]
    const dropdownRef = useRef<HTMLDivElement>(null);
    // const [activeProducts, setActiveProducts] = useState<ListedData[]>([])

    const toggleOpen = useCallback(() => {
        if (disabled) return;
        setOpen((state) => !state);
    }, [disabled]);

    const removeOption = useCallback((name: ListedData['name']) => {
        const newActiveProducts = [...activeProducts.filter((val) => val.name !== name)]
        filter.setActiveValue(filterInnerName, FilterTypes.checkbox, newActiveProducts)
    }, [options, activeProducts])

    useEffect(() => {
        setFilter(filter.filterStr);
        console.log(filter.filterStr)
        if (hasApplied && filter.filterStr !== initialFilterStr) hasApplied(false);
    }, [filter.filterStr])

    return (
        <div
            ref={mergeRefs(ref, rootRef)}
            data-name={filterBarName}
            className={styles.filterbar}
        >
            <div
                className={styles.filterbarControl}
                onClick={toggleOpen}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-disabled={disabled}
            >
                <div className={styles.filterbarBarWrapper}>
                    <div className={styles.filterbarBar}>
                        <ul className={styles.filterbarBarContainer}>
                            {activeProducts && activeProducts.length > 0 ? (
                                activeProducts.map((p) => (
                                    <FilterBarOption
                                        key={p.name}
                                        name={p.name}
                                        label={p.label}
                                        onRemove={removeOption}
                                    />
                                ))
                            ) : (
                                <span className={styles.filterbarPlaceholder}>
                                    Нет выбранных опций
                                </span>
                            )}
                        </ul>
                    </div>
                    <span className={styles.filterbarIconWrapper}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(219, 219, 219)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.filterbarIcon}
                        >
                            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
                        </svg>
                    </span>
                </div>
            </div>

            <CSSTransition
                in={open && !disabled}
                timeout={180}
                nodeRef={dropdownRef}
                mountOnEnter
                unmountOnExit
                classNames={{
                    enter: styles.ddEnter,
                    enterActive: styles.ddEnterActive,
                    exit: styles.ddExit,
                    exitActive: styles.ddExitActive,
                }}
            >
                <div ref={dropdownRef} className={styles.dropdownLayer}>
                    <FilterDropdown>
                        <Filter {...filter} />
                    </FilterDropdown>
                </div>
            </CSSTransition>
        </div>
    );
});

export default FilterBar;


// const getOptions = (options: Option[], values: string[]) =>
//     values
//         .map((v) => options.find((o) => o.value === v))
//         .filter((o): o is Option => !!o);

// const coerceInitial = (
//     mode: "single" | "multiple",
//     value?: string | string[],
//     def?: string | string[]
// ) => {
//     const src = value ?? def;
//     if (mode === "multiple") {
//         return Array.isArray(src) ? src : src ? [src] : [];
//     }
//     return Array.isArray(src) ? src[0] ?? "" : src ?? "";
// };

// import { FC } from "react";
// import styles from "./select.module.css"
// import SelectOption from "./SelectOption";

// const initOpts = ["Ягоды", "Покеболлы"]

// interface SelectProps {
//     mode: 'single' | 'multiple';
// }

// const Select: FC<SelectProps> = () => {
//     return (
//         <div className={styles.filterbarBarWrapper}>
//             <div className={styles.filterbarBar}>
//                 <ul className={styles.filterbarBarContainer}>
//                     {initOpts.map((opt, idx) => (
//                         <SelectOption key={idx} name={opt}/>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

// export default Select;
