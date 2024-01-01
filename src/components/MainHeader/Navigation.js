import React from "react";
import { Link } from "react-router-dom";

import { Menu } from "antd";

import classes from "./Navigation.module.css";

const Navigation = (props) => {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
      {props.isLoggedIn && (
        <>
          <Menu.Item key="4">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/rentals">Rentals</Link>
          </Menu.Item>
          <Menu.Item key="3" onClick={props.onLogout}>
            Logout
          </Menu.Item>
        </>
      )}
    </Menu>
  );
};

export default Navigation;
