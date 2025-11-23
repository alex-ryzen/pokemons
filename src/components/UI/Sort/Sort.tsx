import React, { FC, useState, ChangeEvent } from "react";
import styles from './sort.module.css'
import { useSort, SortData, SortOption } from "../../../hooks/useSort";

interface SortProps {
    options: SortOption[];
    sortData: SortData;
    onChange: (optName: SortOption['optionName']) => void;
    onToggle: () => void;
}

const Sort: FC<SortProps> = ({ options, sortData, onChange, onToggle}) => {
    
    const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };
    // пока дефолт select; todo: custom select element
    return (
        <div className={styles.sortContainer}>
            <label>
                Сортировать по:
                <select value={sortData.sortOption.optionName} onChange={handleOptionChange}>
                    {options.map((opt, idx) => (
                        <option key={`opt_${idx}`} value={opt.optionName}>
                            {opt.optionLabel}
                        </option>
                    ))}
                </select>
            </label>

            <button onClick={onToggle} aria-label="Toggle sort order">
                {sortData.sortOrderBy === "asc" ? "⬆️" : "⬇️"}
            </button>
        </div>
    );
};

export default Sort;
