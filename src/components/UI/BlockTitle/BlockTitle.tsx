import type { CSSProperties } from "react";
import styles from './blockTitle.module.css'


interface BlockTitleProps {
    children: string;
    onClick?: () => void;
    extClassName?: string;
    style?: CSSProperties;
}

const BlockTitle = ({style, onClick, extClassName, children=""}: BlockTitleProps) => {
    return ( 
        <h2 className={`${styles.btitle} ${extClassName}`} style={style} onClick={onClick}>
            {children}
        </h2>
    );
}
 
export default BlockTitle;