import { FC } from "react";
import styles from "./authForms.module.css"
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

interface RegFormProps {

}

const RegForm: FC<RegFormProps> = ({}) => {
    return ( 
        <div className={`${styles.authFormWrapper}`}>
            <form className={styles.authForm}>
                <Input type="text" label="Login" placeholder="Input login" required></Input>
                <Input type="password" label="Password" placeholder="Input Password" required></Input>
                <Input type="password" label="Password confirmation" placeholder="Input password again" required></Input>
                <Button onClick={()=>{}}>Sign up</Button>
            </form>
        </div>
    );
}
 
export default RegForm;