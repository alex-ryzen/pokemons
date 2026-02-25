import { FormEvent, useCallback, useState } from "react";
import Button from "../UI/Button/Button";
import AuthInput from "../UI/Input/AuthInput";
import { useAppDispatch } from "../../hooks";
import { LoginData } from "../../types/app";
import { useLocation, useNavigate } from "react-router";
import styles from "./authForms.module.css"
import { useLoginMutation } from "../../services/user-service";

const LoginForm = () => {
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState<LoginData>({ login: "", password: "" })
    const [login, {isLoading}] = useLoginMutation();
    const navigate = useNavigate();
    const location = useLocation();

    const submitForm = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = login(formData)
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
                <Button type="submit" isLoading={ isLoading }><span style={{padding: "8px 16px"}}>Sign in</span></Button>
            </form>
        </div>
    );
}

export default LoginForm;