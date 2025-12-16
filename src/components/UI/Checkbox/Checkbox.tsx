import { ChangeEvent, FC, memo } from "react";
import styles from "./checkbox.module.css"
import { ListedData } from "../../../types/app";

export interface CheckboxProps extends ListedData {
    isChecked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void; //
}
const Checkbox: FC<CheckboxProps> = memo(({name, label, isChecked, onChange}) => {
    return ( 
        <li className={styles.checkboxWrapper}>
            <label htmlFor={name} className={styles.checkbox}>
                <input type="checkbox" id={name} name={name} checked={isChecked} onChange={onChange} className={styles.checkboxInput} />
                <span className={styles.checkmark}></span>
                {label}
            </label>
        </li>
    );
});
 
export default Checkbox;