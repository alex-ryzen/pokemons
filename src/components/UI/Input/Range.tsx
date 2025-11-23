import React from 'react';
import styles from './range.module.css';
import { RangeData } from '../../../types/app';

export type RangeProps = {
    value?: RangeData,
    onChange: (value: RangeData) => void;
}

const Range: React.FC<RangeProps> = ({ value, onChange }) => {
    
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value === '' ? '' : Number(e.target.value);
        onChange({ 
            name: value ? value.name : "",
            max: value ? value.max : "", 
            min: val 
        });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value === '' ? '' : Number(e.target.value);
        onChange({ 
            name: value ? value.name : "",
            max: val,
            min: value ? value.min : ""
        });
    };

    return (
        <div className={styles.rangeWrapper}>
            <label className={styles.fieldLabel}>
                От:
                <input
                    type="number"
                    value={value?.min}
                    onChange={handleMinChange}
                    className={styles.rangeInput}
                />
            </label>
            <label className={styles.fieldLabel}>
                До:
                <input
                    type="number"
                    value={value?.max}
                    onChange={handleMaxChange}
                    className={styles.rangeInput}
                />
            </label>
        </div>
    );
};

export default Range;
