import { FC } from "react";
import styles from './sort.module.css'
import Select from "../Select/Select";
import { ListedData } from "../../../types/app";

// opt.name format: "name-order", where name - name of sort, and order = asc | desc

interface SortProps {
    options: ListedData[];
    sortName: string;
    setSort: (selected: string) => void;
    hasApplied?: (applied: boolean) => void;
}

const Sort: FC<SortProps> = ({ options, sortName, setSort, hasApplied}) => {
    const handleOptionSelect = (opt: ListedData) => { // ChangeEvent<HTMLSelectElement>
        setSort(opt.name);
        if (hasApplied) hasApplied(false);
    };
    return (
        <div className={styles.sortContainer}>
            <label 
                htmlFor={sortName} 
                className={styles.sortLabel}
            >
                Сортировать по:
            </label>
            <Select
                options={options} 
                name={sortName}
                onSelect={handleOptionSelect}>
            </Select>
        </div>
    );
};

export default Sort;
