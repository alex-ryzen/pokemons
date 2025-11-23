import { FC, MouseEvent } from "react";
import styles from "./select.module.css"

interface SelectOptionProps {
    name: string;
    label: string;
    onRemove: (e: MouseEvent, name: string) => void;
}

const SelectOption: FC<SelectOptionProps> = ({name, label, onRemove}) => {
    return ( 
        <li data-option-name={name} className={styles.selectBarOption}>
            <span className={styles.sboText}>{label}</span>
            <button className={styles.sboCloseBtn} onClick={(e) => {e.stopPropagation(); onRemove(e, name)}}>
                <svg className={styles.sboCloseBtnIcon} width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                    <path className={styles.sboCloseBtnIconPath} d="M4.57808 3.99971L7.50776 0.507518C7.55687 0.449483 7.51558 0.361313 7.43968 0.361313H6.54906C6.4966 0.361313 6.44638 0.38475 6.41178 0.424929L3.99549 3.30551L1.57919 0.424929C1.54571 0.38475 1.49549 0.361313 1.44191 0.361313H0.551289C0.475396 0.361313 0.434102 0.449483 0.483209 0.507518L3.4129 3.99971L0.483209 7.49189C0.472208 7.50483 0.465151 7.52065 0.462875 7.53748C0.460598 7.55431 0.463198 7.57143 0.470367 7.58683C0.477535 7.60222 0.48897 7.61523 0.503314 7.62432C0.517658 7.63341 0.534309 7.63819 0.551289 7.6381H1.44191C1.49437 7.6381 1.54459 7.61466 1.57919 7.57448L3.99549 4.6939L6.41178 7.57448C6.44526 7.61466 6.49549 7.6381 6.54906 7.6381H7.43968C7.51558 7.6381 7.55687 7.54993 7.50776 7.49189L4.57808 3.99971Z"/>
                </svg>
            </button>
        </li>
    );
}
 
export default SelectOption;