// import { Flex } from "antd";
import React from "react";
import { Outlet } from "react-router";
import styles from "./authLayout.module.css"

const AuthLayout = () => {
  return (
    <div className={styles.mainContainer}>
        <Outlet/>
    </div>
  );
}

export default AuthLayout;