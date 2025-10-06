import { FC } from "react";
import styles from "./authForms.module.css"
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

interface LoginFormProps {

}

const LoginForm: FC<LoginFormProps> = ({}) => {
    return ( 
        <div className={`${styles.authFormWrapper}`}>
            <form className={styles.authForm}>
                <Input type="text" label="Login" placeholder="Input login" required></Input>
                <Input type="password" label="Password" placeholder="Input Password" required></Input>
                <Button onClick={()=>{}}>Sign in</Button>
            </form>
        </div>
    );
}
 
export default LoginForm;