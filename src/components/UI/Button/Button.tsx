import { CSSProperties } from "react";
import styles from './button.module.css'

interface ButtonProps {
    text: string;
    onClick: () => void;
    href?: string;
    style?: CSSProperties;
}

const Button = ({text, onClick, href, style}: ButtonProps) => {
    return (
        href 
        ? 
            <a className="linkButton" href={href} style={style}>
                {text}
            </a> 
        : 
            <button className="button" style={style} onClick={onClick}>
                {text}
            </button>
    );
}
 
export default Button;