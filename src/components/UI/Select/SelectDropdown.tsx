import { FC, ReactNode } from "react";
import styles from './select.module.css'

export interface SelectDropdownProps {
    children?: ReactNode;
}

const SelectDropdown: FC<SelectDropdownProps> = ({children}) => {
    return ( 
        <div className={styles.selectDropdown} role="listbox" aria-multiselectable>
            <div className={styles.selectDropdownContainer}>
                {children}
            </div>
        </div>
    );
}
 
export default SelectDropdown;