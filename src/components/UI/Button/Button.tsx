import { CSSProperties } from "react";
import styles from './button.module.css'

interface ButtonProps {
    text: string;
    onClick: () => void;
    link?: string;
    style?: CSSProperties;
}

const Button = ({text, onClick, link, style}: ButtonProps) => {
    return (
        link 
        ? 
            <a className="linkButton" href={link} style={style}>
                {text}
            </a> 
        : 
            <button className="button" style={style} onClick={onClick}>
                {text}
            </button>
    );
}
 
export default Button;