
import { FC, ForwardedRef, forwardRef, HTMLInputTypeAttribute, useId } from 'react';
import styles from './input.module.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: HTMLInputTypeAttribute;
    id?: string;
    ref?: ForwardedRef<HTMLInputElement>
}

const Input: FC<InputProps> = forwardRef(({ id, type , ...props}, ref) => {
    const inputId = id || useId();
    return (
        <input
            id={inputId}
            className={styles.input}
            ref={ref}
            type={type}
            {...props}
        />
    );
})

export default Input;