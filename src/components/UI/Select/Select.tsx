import { FC, useMemo, useState, useCallback, ReactNode } from "react";
import styles from "./select.module.css";
import SelectOption from "./SelectOption";
import SelectDropdown from "./SelectDropdown";
import { useOutsideClick } from "../../../hooks/useClickOutside";
import { SelectMode } from "../../../hooks/useSelect";
import { ListedData } from "../../../types/app";

export interface SelectProps {
    options: ListedData[];
    mode: SelectMode;
    setOptions?: (options: ListedData[]) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    children?: ReactNode;
}


const Select: FC<SelectProps> = ({
    mode = "multiple",
    options,
    setOptions,
    placeholder = "Выберите...",
    disabled,
    className,
    children
}) => {
    const [open, setOpen] = useState(false);
    const rootRef = useOutsideClick<HTMLDivElement>(() => setOpen(false));
    // todo: use useCallback and useMemo

    const toggleOpen = useCallback(() => {
        if (disabled) return;
        setOpen((state) => !state);
    }, [disabled]);

    const removeOption = useCallback((name: ListedData['name']) => {
        if(setOptions) setOptions(options.filter((val) => val.name !== name))
    }, [options])

    return (
        <div
            ref={rootRef}
            className={[styles.select, className].filter(Boolean).join(" ")}
        >
            <div
                className={styles.selectControl}
                onClick={toggleOpen}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-disabled={disabled}
            >
                {mode === "multiple" ? (
                    <div className={styles.selectBarWrapper}>
                        <div className={styles.selectBar}>
                            <ul className={styles.selectBarContainer}>
                                {options.length > 0 ? (
                                    options.map((opt) => (
                                        <SelectOption
                                            key={opt.name}
                                            name={opt.name}
                                            label={opt.label}
                                            onRemove={(e, name) => {
                                                removeOption(name);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <span className={styles.placeholder}>
                                        {placeholder}
                                    </span>
                                )}
                            </ul>
                        </div>
                        <span className={styles.selectIconWrapper}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="rgba(219, 219, 219)"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className={styles.selectIcon}
                            >
                                <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
                            </svg>
                        </span>
                    </div>
                ) : (
                    <div className={styles.singleValue}>
                        <span
                            className={
                                options.length
                                    ? styles.valueText
                                    : styles.placeholder
                            }
                        >
                            {options[0].label ?? placeholder}
                        </span>
                        <span className={styles.orderArrow}>
                            {open ? "▲" : "▼"}
                        </span>
                    </div>
                )}
            </div>

            {open && !disabled && <SelectDropdown>{children}</SelectDropdown>}
        </div>
    );
};

export default Select;


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
//         <div className={styles.selectBarWrapper}>
//             <div className={styles.selectBar}>
//                 <ul className={styles.selectBarContainer}>
//                     {initOpts.map((opt, idx) => (
//                         <SelectOption key={idx} name={opt}/>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

// export default Select;
