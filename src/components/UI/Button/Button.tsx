import { CSSProperties } from "react";
import styles from './button.module.css'
import { Link } from "react-router";

interface ButtonProps {
    children: string;
    onClick: () => void;
    link?: string;
    internalLink?: boolean;
    style?: CSSProperties;
}

const Button = ({children: text, onClick, link, style, internalLink = true}: ButtonProps) => {
    return (
        link 
        ?
            internalLink
            ?
                <Link className={styles.linkButton} to={link} style={style}>
                    {text}
                </Link>
            :
                <a className={styles.urlButton} href={link} style={style}>
                    {text}
                </a> 
        : 
            <button className={styles.button} style={style} onClick={onClick}>
                {text}
            </button>
    );
}
 
export default Button;