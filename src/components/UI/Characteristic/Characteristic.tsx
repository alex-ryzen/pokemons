import { FC } from "react";
import styles from "./characteristic.module.css"

export interface CharacteristicProps {
    name: string;
    value: string | number;
    idx?: string | number;
}

const Characteristic: FC<CharacteristicProps> = ({name, value, idx}) => {
    return ( 
        <div key={`ch_${idx}`} className={styles.charContainer}>
            <p className={styles.charName}>{name}</p>
            <span className={styles.charValue}>{value}</span>
        </div>
    );
}
 
export default Characteristic;