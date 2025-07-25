import type { CSSProperties } from "react";
import styles from './blockTitle.module.css'


interface BlockTitleProps {
    text: string;
    style?: CSSProperties;
}

const BlockTitle = ({style, text=""}: BlockTitleProps) => {
    return ( 
        <h2 className={styles.btitle} style={style}>
            {text}
        </h2>
    );
}
 
export default BlockTitle;