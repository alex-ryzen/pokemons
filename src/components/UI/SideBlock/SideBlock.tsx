import type { ReactNode } from "react";
import BlockTitle from "../BlockTitle/BlockTitle";
import styles from "./sideBlock.module.css"


interface SideBlockProps {
    titleText?: string;
    children: ReactNode;
}

const SideBlock = ({titleText, children}: SideBlockProps) => {
    return ( 
        <aside className={`${styles['aside-block']} content-block`}>
            {titleText && <BlockTitle>{titleText}</BlockTitle>}
            {children}
        </aside>
    );
}
 
export default SideBlock;