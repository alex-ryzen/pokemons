import styles from "./header.module.css";
import BlockTitle from "../BlockTitle/BlockTitle";
import Logo from "../LogoContainer/Logo";
import { formatBalance } from "../../../utils/formatters";
import { Link } from "react-router";
import { useEffect } from "react";

interface HeaderProps {}

const Header = (headerProps: HeaderProps) => {
        useEffect(() => {
          console.log("Header render")
        })
    return (
        <header className={`${styles["header"]} content-block`} id="header">
            <div className={styles["header-container"]}>
                <Logo />
                <div className={styles["user-container"]}>
                    <Link title="Login" className={styles["user-profile"]} to="/auth">
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
                    <div className={styles["balance-container"]}>
                        <img
                            src={"./images/icon/pokecoin.png"}
                            alt=""
                            className={styles["balance-coin-icon"]}
                        />
                        <BlockTitle>{formatBalance(100000000)}</BlockTitle>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
