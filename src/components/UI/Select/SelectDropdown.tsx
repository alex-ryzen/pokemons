import { FC, MouseEvent, TouchEvent } from 'react';
import styles from './select.module.css'
import { SelectProps } from './Select';
import { ListedData } from '../../../types/app';

type SelectDropdownProps = Pick<SelectProps, 'options' | 'name'> & {
    selected: ListedData;
    handleSelect: (e: MouseEvent<HTMLLIElement> | TouchEvent<HTMLLIElement>, opt: ListedData) => void;
}

const SelectDropdown:FC<SelectDropdownProps> = ({options, name, handleSelect, selected}) => {
    return ( 
        <div className={styles.selectDropdown}>
            <ul className={styles.optionContainer}>
                {options.map((opt, idx) =>
                    <li key={opt.id || `${name}_opt_${idx}`} id={opt.id} className={styles.option} data-selected={opt.name === selected.name} tabIndex={0} onClick={e => handleSelect(e, opt)}>
                        <span>{opt.label}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}
 
export default SelectDropdown;