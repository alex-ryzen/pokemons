import { FormEvent, MouseEvent, useCallback, useState } from "react";
import Button from "../UI/Button/Button";
import AuthInput from "../UI/Input/AuthInput";
import { useAppDispatch } from "../../hooks";
import { loginUser } from "../../services/api-actions";
import { LoginData } from "../../types/app";
import { useLocation, useNavigate } from "react-router";
import styles from "./authForms.module.css"

// interface AuthFormProps { 
//     children: ReactNode | ReactNode[];
//     ref?: RefObject<HTMLFormElement | null>
// }

const LoginForm = () => {
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState<LoginData>({ login: "", password: "" })
    const navigate = useNavigate();
    const location = useLocation();

    const submitForm = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = dispatch(loginUser(formData))
        //res.then(() => setFormData({ login: "", password: "" }))
        res.then(() => navigate(location.state?.from?.pathname || "/home"));
    }, [dispatch, navigate, location, formData.login, formData.password])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    return (
        <div className={`${styles.authFormWrapper}`}>
            <form className={styles.authForm} onSubmit={submitForm}>
                <AuthInput name="login" type="text" label="Login" value={formData.login} onChange={handleChange} placeholder="Input login" required></AuthInput>
                <AuthInput name="password" type="password" label="Password" value={formData.password} onChange={handleChange} placeholder="Input Password" required></AuthInput>
                <Button type="submit"><span>Sign in</span></Button>
            </form>
        </div>
    );
}

export default LoginForm;