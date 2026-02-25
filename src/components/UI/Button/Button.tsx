import { ButtonHTMLAttributes, ForwardedRef, forwardRef, ReactNode } from "react";
import styles from './button.module.css'

//type ButtonRef = Ref<HTMLButtonElement> | Ref<HTMLAnchorElement> //Ref<ReturnType<typeof Link>>

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    isLoading?: boolean;
}

const Button = forwardRef(({ children, className, isLoading, ...props }: ButtonProps, ref?: ForwardedRef<HTMLButtonElement>) => {
    let classes = className ? `${styles.button} ${className}` : styles.button
    if (isLoading) {
        classes = classes.concat(` ${styles.isLoading}`)
    }
    return (
        <button ref={ref} className={classes} {...props}>
            {isLoading
                ? (
                    <svg style={{height: "24px", padding: "4px"}} fill="#FFFFFFFF" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" /></path></svg>
                )
                : (children)
            }
        </button>
    );
})

export default Button;