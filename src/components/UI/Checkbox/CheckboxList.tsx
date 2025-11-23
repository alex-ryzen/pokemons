import { ChangeEvent, FC, useCallback, useState } from "react";
import styles from "./checkbox.module.css"
import Checkbox from "./Checkbox";
import { ListedData } from "../../../types/app";

export interface CheckboxListProps {
    defaultCheckboxes: ListedData[]
    activeCheckboxes?: Set<string>
    onChange: (value: Set<string>) => void;
}

const CheckboxList: FC<CheckboxListProps> = ({ defaultCheckboxes, activeCheckboxes, onChange }) => {
    
    const toggle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target
        const newSet = new Set<string>(activeCheckboxes)
        if (newSet.has(name)) {
            newSet.delete(name)
        } else {
            newSet.add(name);
        }
        onChange(newSet)
    }, [onChange, activeCheckboxes]);

    return (
        <div className={styles.checkboxListWrapper}>
            <ul className={styles.checkboxList} aria-multiselectable='true'>
                {defaultCheckboxes.map((cb, idx) =>
                    <Checkbox key={idx} name={`${cb.name}`} label={cb.label} isChecked={activeCheckboxes?.has(cb.name) || false} onChange={toggle} />
                )}
            </ul>
        </div>
    );
}

export default CheckboxList;