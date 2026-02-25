import { FormEvent, useCallback, useState } from "react";
import Button from "../UI/Button/Button";
import AuthInput from "../UI/Input/AuthInput";
import { RegisterData } from "../../types/app";
import { useAppDispatch } from "../../hooks";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import styles from "./authForms.module.css"
import { useRegisterMutation } from "../../services/user-service";

const RegForm = () => {
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState<RegisterData>({ username: "", email: "", password: "", password_confirmation: "" })
    const [register, {isLoading}] = useRegisterMutation()
    const navigate = useNavigate();
    const location = useLocation();

    const submitForm = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password === formData.password_confirmation) {
            const res = register(formData)
            //res.then(() => setFormData({ username: "", email: "", password: "", password_confirmation: "" }))
            res.then(() => navigate(location.state?.from?.pathname || "/home"));
        } else {
            toast.warn("Пароли не совпадают!")
        }
    }, [dispatch, navigate, location, formData.username, formData.email, formData.password, formData.password_confirmation]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    return (
        <div className={`${styles.authFormWrapper}`}>
            <form id="" className={styles.authForm} onSubmit={submitForm}>
                <AuthInput name="username" type="text" label="Login" value={formData.username} onChange={handleChange} placeholder="Input username" autoComplete="username" required></AuthInput>
                <AuthInput name="email" type="email" label="Email" value={formData.email} onChange={handleChange} placeholder="Input email" autoComplete="email" required></AuthInput>
                <AuthInput name="password" type="password" label="Password" value={formData.password} onChange={handleChange} placeholder="Input Password" required></AuthInput>
                <AuthInput name="password_confirmation" type="password" label="Password confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Input password again" required></AuthInput>
                <Button type="submit" isLoading={isLoading}><span style={{padding: "8px 16px"}}>Sign in</span></Button>
            </form>
        </div>
    );
}

export default RegForm;