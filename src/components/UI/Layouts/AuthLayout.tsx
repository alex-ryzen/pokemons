import { Flex } from "antd";
import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <Flex
      vertical={false}
      align="center"
      justify="center"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
      }}
    >
      <Flex vertical justify="center">
        <Outlet/>
      </Flex>
    </Flex>
  );
}

export default AuthLayout;