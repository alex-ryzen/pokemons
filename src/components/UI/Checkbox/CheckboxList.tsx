import { ChangeEvent, FC, useCallback, useState } from "react";
import styles from "./checkbox.module.css"
import Checkbox from "./Checkbox";
import { ListedData } from "../../../types/app";

export interface CheckboxListProps {
    defaultCheckboxes: ListedData[]
    activeCheckboxes?: ListedData[]//Set<string>
    onChange: (value: ListedData[]) => void;
}

const CheckboxList: FC<CheckboxListProps> = ({ defaultCheckboxes, activeCheckboxes, onChange }) => {
    
    const toggle = useCallback((_: ChangeEvent<HTMLInputElement>, cb: ListedData) => {
        const {name} = cb
        const rec = activeCheckboxes ? [...activeCheckboxes].find(a => a.name === name) : null
        const newActiveArr: ListedData[] = 
            activeCheckboxes ? 
                (rec ? activeCheckboxes.filter(a => a.name !== rec.name) 
                    : [...activeCheckboxes, cb]
                ) : []
        onChange(newActiveArr)
    }, [onChange, defaultCheckboxes]);

    return (
        <div className={styles.checkboxListWrapper}>
            <ul className={styles.checkboxList} aria-multiselectable='true'>
                {defaultCheckboxes.map((cb, idx) =>
                    <Checkbox key={idx} name={`${cb.name}`} label={cb.label} isChecked={!!activeCheckboxes?.find(a => a.name === cb.name) || false} onChange={e => toggle(e, cb)} />
                )}
            </ul>
        </div>
    );
}

export default CheckboxList;