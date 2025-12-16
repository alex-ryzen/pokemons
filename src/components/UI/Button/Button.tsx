import { ButtonHTMLAttributes, CSSProperties, ForwardedRef, forwardRef, HTMLAttributes, ReactNode, Ref } from "react";
import styles from './button.module.css'

//type ButtonRef = Ref<HTMLButtonElement> | Ref<HTMLAnchorElement> //Ref<ReturnType<typeof Link>>

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
}

const Button = forwardRef(({ children, className, ...props }: ButtonProps, ref?: ForwardedRef<HTMLButtonElement>) => {
    return (
        <button ref={ref} className={className ? `${styles.button} ${className}` : styles.button} {...props}>
            {children}
        </button>
    );
})

export default Button;