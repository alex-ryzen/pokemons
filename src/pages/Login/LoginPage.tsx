import LoginForm from "../../components/AuthFroms/LoginForm";
import RegForm from "../../components/AuthFroms/RegForm";
import Logo from "../../components/UI/LogoContainer/Logo";
import { Tabs } from "../../components/UI/Tabs/Tabs";
import { useTabs } from "../../hooks/useTabs";
import { TabConfig } from "../../types/app";
import styles from "./loginpage.module.css"

const initLoginTabs: TabConfig[] = [
    {
        key: "reg",
        label: "Sign up",
        content: <RegForm/>
    },
    {
        key: "log",
        label: "Sign in",
        content: <LoginForm/>
    }
]

const LoginPage = () => {
    const tabProps = useTabs(initLoginTabs, "log")
    return ( 
        <div className={styles.authFormContainer} style={{width: 400}}> 
            <div className={styles.formContent}>
                <div className={styles.formLogoContainer}>
                    <Logo></Logo>
                </div>
                <div className={`${styles.formContentContainer} content-block`}>
                    <Tabs {...tabProps}></Tabs>
                </div>
            </div>
        </div>
    );
}
 
export default LoginPage;

// <>
//     <h1>LOGIN PAGE</h1>
// </>