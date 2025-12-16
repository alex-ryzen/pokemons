import { FC, MouseEvent, useRef, useState } from "react";
import Button from "../UI/Button/Button";
import AuthInput from "../UI/Input/AuthInput";
import AuthForm from "./AuthForm";
import { useAppDispatch } from "../../hooks";
import { loginUser } from "../../services/api-actions";
import { LoginData } from "../../types/app";

const LoginForm = () => {
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState<LoginData>({login: "", password: ""})
    const formRef = useRef<HTMLFormElement>(null);
    const submitForm = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        console.log(formData)
        dispatch(loginUser(formData))
        setFormData({login: "", password: ""})
    }
    return (
        <AuthForm ref={formRef}>
            <AuthInput type="text" label="Login" value={formData.login} onChange={e => setFormData({ ...formData, login: e.target.value })} placeholder="Input login" required></AuthInput>
            <AuthInput type="password" label="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Input Password" required></AuthInput>
            <Button type="submit" onClick={submitForm}><span>Sign in</span></Button>
        </AuthForm>
    );
}

export default LoginForm;