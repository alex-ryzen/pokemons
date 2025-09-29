import { CSSProperties, forwardRef, ReactNode, Ref } from "react";
import styles from './button.module.css'
import { Link } from "react-router";

type ButtonRef = Ref<HTMLButtonElement> | Ref<HTMLAnchorElement> //Ref<ReturnType<typeof Link>>

interface ButtonProps {
    children: string;
    onClick: () => void;
    link?: string;
    internalLink?: boolean;
    style?: CSSProperties;
}

const Button = forwardRef(({children: text, onClick, link, style, internalLink = true}: ButtonProps, ref: ButtonRef) => {
    return (
        link 
        ?
            internalLink
            ?
                <Link ref={ref as Ref<HTMLAnchorElement>} className={styles.linkButton} to={link} style={style}>
                    {text}
                </Link>
            :
                <a ref={ref as Ref<HTMLAnchorElement>} className={styles.urlButton} href={link} style={style}>
                    {text}
                </a> 
        : 
            <button ref={ref as Ref<HTMLButtonElement>} className={styles.button} style={style} onClick={onClick}>
                <span>{text}</span>
            </button>
    );
})
 
export default Button;