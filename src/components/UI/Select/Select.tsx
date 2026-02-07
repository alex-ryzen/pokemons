import { FC, memo, MouseEvent, PointerEvent, TouchEvent, useCallback, useRef, useState } from "react";
import styles from './select.module.css'
import { useOutsideClick } from "../../../hooks/useClickOutside";
import { ListedData } from "../../../types/app";
import SelectDropdown from "./SelectDropdown";
import { CSSTransition } from "react-transition-group";

export type SelectMode = "single" | "multiple"; // prototype

export interface SelectProps {
    name: string;
    options: ListedData[],
    onSelect: (opt: ListedData) => void,
    disabled?: boolean;
}

const Select: FC<SelectProps> = memo(({ name, options, onSelect, disabled }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<ListedData>(options[0])
    const rootRef = useOutsideClick<HTMLDivElement>(() => setOpen(false), open);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const toggleOpen = () => {
        if (disabled) return;
        setOpen((state) => !state);
    };
    const handleSelect = useCallback((_: MouseEvent | TouchEvent, opt: ListedData) => { // e or _ for MouseEvent | TouchEvent or PointerEvent (react)
        setSelected(opt);
        onSelect(opt);
        toggleOpen();
    }, [options])
    return (
        <div ref={rootRef} className={styles.selectWrapper}>
            <select name={name} className={styles.select} onClick={(e) => {e.preventDefault()}} aria-label={`${name} custom select`}></select>
            <div 
                className={styles.selectBar} 
                onClick={toggleOpen}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-disabled={disabled}
            >
                <span>{selected.label}</span>
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
                <div ref={dropdownRef} className={styles.ddLayer}>
                    <SelectDropdown options={options} name={name} handleSelect={handleSelect} selected={selected}></SelectDropdown>
                </div>
            </CSSTransition>
        </div>
    );
})

export default Select;