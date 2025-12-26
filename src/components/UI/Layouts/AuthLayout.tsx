// import { Flex } from "antd";
import React from "react";
import { Outlet } from "react-router";
import styles from "./authLayout.module.css"

const AuthLayout = () => {
  return (
    <main className={styles.mainContainer}>
        <Outlet/>
    </main>
  );
}

export default AuthLayout;