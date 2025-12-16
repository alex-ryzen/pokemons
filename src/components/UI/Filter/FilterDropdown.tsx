import { FC, ReactNode } from "react";
import styles from './filterBar.module.css'

export interface SelectDropdownProps {
    children?: ReactNode;
}

const FilterDropdown: FC<SelectDropdownProps> = ({children}) => {
    return ( 
        <div className={styles.filterbarDropdown} role="listbox" aria-multiselectable>
            <div className={styles.filterbarDropdownContainer}>
                {children}
            </div>
        </div>
    );
}
 
export default FilterDropdown;