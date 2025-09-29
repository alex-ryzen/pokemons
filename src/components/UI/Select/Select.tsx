import { FC } from "react";
import styles from "./select.module.css"
import SelectOption from "./SelectOption";

const initOpts = ["Ягоды", "Покеболлы"]


interface SelectProps {

}

const Select: FC<SelectProps> = () => {
    return ( 
        <div className={styles.selectBarWrapper}>
            <div className={styles.selectBar}>
                <ul className={styles.selectBarContainer}>
                    {initOpts.map((opt, idx) => (
                        <SelectOption key={idx} name={opt}/>
                    ))}
                </ul>
            </div>
        </div>
    );
}
 
export default Select;