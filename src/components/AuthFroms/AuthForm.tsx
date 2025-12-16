import { FC, ForwardedRef, forwardRef, MouseEvent, ReactNode, RefObject, useState } from "react";
import styles from "./authForms.module.css"

interface AuthFormProps { 
    children: ReactNode | ReactNode[];
    ref?: RefObject<HTMLFormElement | null>
}
const AuthForm: FC<AuthFormProps> = forwardRef(({children}, ref) => {
    return (
        <div className={`${styles.authFormWrapper}`}>
            <form ref={ref} className={styles.authForm}>
                {children}
            </form>
        </div>
    );
});

export default AuthForm;