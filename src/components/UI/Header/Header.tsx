import styles from "./header.module.css";
import BlockTitle from "../BlockTitle/BlockTitle";
import Logo from "../LogoContainer/Logo";
import { formatBalance } from "../../../utils/formatters";
import { Link } from "react-router";
import { useEffect } from "react";
import { useAppSelector } from "../../../hooks";
import { RouteNames } from "../../../router/routes";
import MoneyTitle from "../Balance/Balance";
import { useGetUserDataQuery } from "../../../services/user-service";

interface HeaderProps { }

const Header = (headerProps: HeaderProps) => {
    const { isAuth } = useAppSelector(state => state.auth);
    const { data } = useGetUserDataQuery(undefined);
    return (
        <header className={`${styles["header"]} content-block`} id="header">
            <div className={styles["header-container"]}>
                <Logo />
                <div className={styles["user-container"]}>
                    {isAuth && <h3 className={styles.userProfileName}>{`Hello, ${data?.user?.username}`}</h3>}
                    <Link title="Login" className={styles["user-profile"]} to={isAuth ? RouteNames.PROFILE : RouteNames.AUTH}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--secondary-color)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-circle-user-round-icon lucide-circle-user-round"
                        >
                            <path d="M18 20a6 6 0 0 0-12 0" />
                            <circle cx="12" cy="10" r="4" />
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                    </Link>
                    <MoneyTitle amount={100000000}/>
                </div>
            </div>
        </header>
    );
};

export default Header;
