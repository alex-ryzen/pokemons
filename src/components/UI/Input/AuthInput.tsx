// todo: different input types
import {
    FC,
    ForwardedRef,
    forwardRef,
    HTMLInputTypeAttribute,
    memo,
    MouseEvent,
    useId,
    useState,
} from "react";
import styles from "./input.module.css";
import Input from "./Input";

export type InputExtendedClassNames = {
    containerClassName?: string;
    wrapperClassName?: string;
    inputClassName?: string;
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: HTMLInputTypeAttribute;
    id?: string;
    name?: string;
    ref?: ForwardedRef<HTMLInputElement>
    label?: string;
    error?: string;
    extClassName?: InputExtendedClassNames;
}

const AuthInput: FC<InputProps> = memo(forwardRef((
    (
        {
            type = "text",
            id,
            name,
            label,
            error,
            extClassName,
            ...props
        },
        ref
    ) => {
        const [isHidden, setIsHidden] = useState(true)
        const inputId = id || useId();
        const inputClasses = [
            styles.input,
            error && styles.inputError,
        ].filter(Boolean).join(" ");

        const toggleHidden = (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIsHidden(!isHidden)
        }

        return (
            <div className={`${styles.inputContainer} ${extClassName?.containerClassName ?? ""}`}>
                {label && (
                    <div className={styles.inputLabelContainer}>
                        {props.required && (
                            <span title="required">
                                <svg
                                    width="7"
                                    height="6"
                                    viewBox="0 0 7 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.594 2.4C6.594 2.19 6.51 2.008 6.342 1.868C6.174 1.728 5.978 1.644 5.768 1.644C5.488 1.644 5.124 1.854 4.69 2.26C4.382 2.554 4.046 2.778 3.696 2.918C3.724 2.526 3.836 2.148 4.004 1.784C4.2 1.35 4.312 1.042 4.312 0.859999C4.312 0.622 4.228 0.411999 4.088 0.244C3.92 0.0759994 3.724 -0.00800037 3.5 -0.00800037C3.262 -0.00800037 3.066 0.0759994 2.912 0.244C2.758 0.411999 2.688 0.622 2.688 0.859999C2.688 1.042 2.786 1.35 2.996 1.784C3.164 2.148 3.262 2.526 3.304 2.918C2.94 2.778 2.618 2.554 2.31 2.26C1.862 1.854 1.512 1.644 1.232 1.644C1.008 1.644 0.826 1.728 0.658 1.868C0.49 2.008 0.406 2.19 0.406 2.4C0.406 2.68 0.504 2.89 0.7 3.044C0.896 3.212 1.134 3.282 1.414 3.282C1.484 3.282 1.652 3.268 1.904 3.24C2.156 3.212 2.352 3.198 2.478 3.198C2.688 3.198 2.926 3.226 3.178 3.268C2.954 3.52 2.632 3.772 2.24 3.996C1.904 4.192 1.694 4.332 1.582 4.43C1.386 4.626 1.288 4.864 1.288 5.116C1.288 5.34 1.358 5.536 1.512 5.676C1.666 5.844 1.862 5.914 2.086 5.914C2.576 5.914 2.912 5.48 3.08 4.612C3.164 4.164 3.304 3.786 3.5 3.492C3.682 3.786 3.822 4.164 3.92 4.612C4.088 5.48 4.41 5.914 4.914 5.914C5.138 5.914 5.32 5.844 5.488 5.676C5.628 5.536 5.712 5.34 5.712 5.116C5.712 4.864 5.614 4.626 5.418 4.43C5.306 4.332 5.082 4.192 4.76 3.996C4.354 3.772 4.046 3.52 3.822 3.268C4.074 3.226 4.298 3.198 4.522 3.198C4.634 3.198 4.83 3.212 5.096 3.24C5.348 3.268 5.502 3.282 5.586 3.282C5.852 3.282 6.09 3.212 6.3 3.044C6.496 2.89 6.594 2.68 6.594 2.4Z"
                                        fill="var(--danger)"
                                    />
                                </svg>
                            </span>
                        )}
                        <label htmlFor={inputId} className={`${styles.inputLabel} ${error ? styles.inputLabelError : ""}`}>
                            {label}
                        </label>
                    </div>
                )}

                <div className={`${styles.inputWrapper} ${extClassName?.wrapperClassName ?? ""}`}>
                    <Input
                        ref={ref}
                        id={inputId}
                        name={name}
                        type={isHidden ? type : "text"}
                        className={inputClasses}
                        aria-invalid={!!error}
                        aria-describedby={
                            error ? `${id}-description` : undefined
                        }
                        {...props}
                    />

                    {type === "password" && (
                        <button type="button" className={styles.hideButton} onClick={toggleHidden}>
                            {isHidden ?
                                (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--border-color)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-eye-off-icon lucide-eye-off"
                                    >
                                        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" />
                                    </svg>
                                    )
                                :
                                    (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--border-color)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-eye-icon lucide-eye"
                                    >
                                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )
                            }
                        </button>
                    )}
                </div>

                {error && (
                    <span
                        id={`${id}-description`}
                        className={`${styles.inputErrorSpan}`}
                        role="alert"
                    >
                        {error}
                    </span>
                )}
            </div>
        );
    }
)));

export default AuthInput;


// onChange={onChange} // e: ChangeEvent<HTMLInputElement>
// onFocus={onFocus} // e: FocusEvent<HTMLInputElement>
// onBlur={onBlur} // e: FocusEvent<HTMLInputElement>