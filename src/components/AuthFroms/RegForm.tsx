import { FC, MouseEvent, useRef, useState } from "react";
import Button from "../UI/Button/Button";
import AuthInput from "../UI/Input/AuthInput";
import AuthForm from "./AuthForm";
import { RegisterData } from "../../types/app";
import { useAppDispatch } from "../../hooks";
import { registerUser } from "../../services/api-actions";

const RegForm = () => {
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState<RegisterData>({username: "", email: "", password: "", password_confirmation: ""})
    const formRef = useRef<HTMLFormElement>(null);
    const submitForm = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (formData.password === formData.password_confirmation) {
            console.log("ПАРОЛИ СОВПАДАЮТ")
            dispatch(registerUser(formData))
            setFormData({username: "", email: "", password: "", password_confirmation: ""})
        } else {
            console.log("ПАРОЛИ РАЗНЫЕ")
        }
    }
    return (
        <AuthForm ref={formRef}>
            <AuthInput type="text" label="Login" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Input username" required></AuthInput>
            <AuthInput type="email" label="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Input email" required></AuthInput>
            <AuthInput type="password" label="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Input Password" required></AuthInput>
            <AuthInput type="password" label="Password confirmation" value={formData.password_confirmation} onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })} placeholder="Input password again" required></AuthInput>
            <Button type="submit" onClick={submitForm}><span>Sign in</span></Button>
        </AuthForm>
    );
}

export default RegForm;