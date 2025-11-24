import { FC, HTMLAttributes, ReactNode } from "react";
import styles from "./itemGrid.module.css"

export interface IGridItemProps extends HTMLAttributes<HTMLDivElement> {
    text?: string;
    img?: string;
    imgLabel?: string;
}

export const GridItem: FC<IGridItemProps> = ({
    text,
    img,
    imgLabel,
    ...props
}) => {
    return (
        <div {...props} className={styles.gridItem}>
            <img className={styles.gridItemImg} src={img} alt={imgLabel}></img>
            <p>{text}</p>
        </div>
    );
};
