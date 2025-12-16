import { FC } from "react";
import Button from "../Button/Button";

import styles from "./stats.module.css"
import Characteristic, { CharacteristicProps } from "../Characteristic/Characteristic";
import Input from "../Input/Input";


interface StatsProps {
    stats: Array<CharacteristicProps>
    img?: string;
}

const Stats: FC<StatsProps> = ({stats, img}) => {
    return ( 
        <div className={styles.statsWrapper}>
            <div className={styles.statsContainer}>
                <div className={styles.statPokeContainer}>
                    <img className={styles.statPokeImg} src={img ?? '/images/placeholders/thumbnail.webp'} alt="" />
                    <Button onClick={() => {console.log("D E L E T E D")}}>
                        <span>Удалить покемона</span> 
                    </Button>
                </div>
                <div className={styles.statListContainer}>
                    <ul className={styles.statList}>
                        {stats.map((stat, idx) => 
                            <li key={idx} className={styles.statListItem}>
                                <Characteristic {...stat}></Characteristic>
                            </li>
                        )}
                    </ul>
                    <div className={styles.statInpContainer}>
                        <Input type="text" placeholder="Псевдоним покемона"></Input>
                        <Button onClick={() => {console.log("S A V E D")}} style={{padding: "0px 16px "}}>
                            <span>Сохранить</span> 
                        </Button>
                    </div>      
                </div>
            </div>
        </div>
    );
}
 
export default Stats;