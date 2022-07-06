import React from "react";

import { Menu } from "antd";

import classes from "./Navigation.module.css";

const Navigation = (props) => {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
      {props.isLoggedIn && (
        <Menu.Item key="3" onClick={props.onLogout}>
          Logout
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Navigation;
