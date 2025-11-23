import { ChangeEvent, FC, memo } from "react";
import styles from "./checkbox.module.css"
import { ListedData } from "../../../types/app";

export interface CheckboxProps extends ListedData {
    isChecked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void; //
}
const Checkbox: FC<CheckboxProps> = memo(({name, label, isChecked, onChange}) => {
    return ( 
        <div className={styles.checkboxWrapper}>
            <label htmlFor={name}>
                <input type="checkbox" name={name} checked={isChecked} onChange={onChange} className={styles.checkboxInput} />
                <div className={styles.checkboxContainer}>
                    <div className={styles.checkboxCustomBox}></div>
                    <span>{label}</span>
                </div>
            </label>
        </div>
    );
});
 
export default Checkbox;