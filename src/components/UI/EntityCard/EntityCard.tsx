import { FC, MouseEvent } from "react";
import styles from "./entityCard.module.css"
import Characteristic, { CharacteristicProps } from "../Characteristic/Characteristic";

export interface EntityCardProps {
    id: string;
    title: string;
    properties: Array<CharacteristicProps>;//{ [key: string]: string };
    img?: string;
    onOpen: () => void; //e: MouseEvent<HTMLButtonElement>, id: EntityCardProps['id'] 
}

const EntityCard: FC<EntityCardProps> = ({id, title, properties, img, onOpen}) => {
    return ( 
        <article data-card-id={id} className={`${styles.entityCard} content-block`}
            style={{width: 165}} //height: 247
        >
            <div className={styles.entityCardContainer}>
                <div className={styles.entityHeader}>
                    <h4 className={styles.entityTitle}>{title}</h4>
                    <button className={styles.entityPropsBtn} onClick={onOpen} >{/** (e) => onManage(e, id)} */}
                        <svg className={styles.entityPropsBtnIcon} width="20" height="20" viewBox="0 -1 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.14 10.9399C17.18 10.6399 17.2 10.3299 17.2 9.99991C17.2 9.67991 17.18 9.35991 17.13 9.05991L19.16 7.4799C19.2474 7.4078 19.3072 7.3076 19.3291 7.19637C19.351 7.08514 19.3336 6.96977 19.28 6.8699L17.36 3.54991C17.3031 3.44976 17.2129 3.37282 17.105 3.33259C16.9971 3.29236 16.8785 3.29141 16.77 3.32991L14.38 4.28991C13.88 3.90991 13.35 3.58991 12.76 3.34991L12.4 0.809905C12.3823 0.695435 12.3241 0.591112 12.236 0.515881C12.1479 0.44065 12.0358 0.399501 11.92 0.399905H8.07996C7.83996 0.399905 7.64996 0.569905 7.60996 0.809905L7.24996 3.34991C6.65996 3.58991 6.11996 3.91991 5.62996 4.28991L3.23996 3.32991C3.01996 3.24991 2.76996 3.32991 2.64996 3.54991L0.739964 6.8699C0.619964 7.0799 0.659964 7.3399 0.859964 7.4799L2.88996 9.05991C2.83996 9.35991 2.79996 9.68991 2.79996 9.99991C2.79996 10.3099 2.81996 10.6399 2.86996 10.9399L0.839964 12.5199C0.752488 12.592 0.692718 12.6922 0.670837 12.8034C0.648955 12.9147 0.666317 13.03 0.719964 13.1299L2.63996 16.4499C2.75996 16.6699 3.00996 16.7399 3.22996 16.6699L5.61996 15.7099C6.11996 16.0899 6.64996 16.4099 7.23996 16.6499L7.59996 19.1899C7.64996 19.4299 7.83996 19.5999 8.07996 19.5999H11.92C12.16 19.5999 12.36 19.4299 12.39 19.1899L12.75 16.6499C13.34 16.4099 13.88 16.0899 14.37 15.7099L16.76 16.6699C16.98 16.7499 17.23 16.6699 17.35 16.4499L19.27 13.1299C19.39 12.9099 19.34 12.6599 19.15 12.5199L17.14 10.9399ZM9.99996 13.5999C8.01996 13.5999 6.39996 11.9799 6.39996 9.99991C6.39996 8.01991 8.01996 6.3999 9.99996 6.3999C11.98 6.3999 13.6 8.01991 13.6 9.99991C13.6 11.9799 11.98 13.5999 9.99996 13.5999Z" fill="var(--primary-color)"/>
                        </svg>
                    </button>
                </div>
                <div className={styles.entityImgContainer}>
                    <img className={styles.entityImg} src={img ?? '/images/placeholders/thumbnail.webp'} alt={title} />
                </div>
                {properties.map((prop, idx) => 
                    <Characteristic key={idx} idx={idx} {...prop}/>
                )}
            </div>
        </article>
    );
}
 
export default EntityCard;