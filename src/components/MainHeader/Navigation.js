import React from "react";
import { NavLink } from "react-router-dom";

import { Menu } from "antd";

import classes from "./Navigation.module.css";

const Navigation = (props) => {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
      {props.isLoggedIn ? (
        <>
          <Menu.Item key="4">
            <NavLink
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              to="/"
            >
              Home
            </NavLink>
          </Menu.Item>
          <Menu.Item key="4">
            <NavLink
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              to="/rentals"
            >
              Rentals
            </NavLink>
          </Menu.Item>
          <Menu.Item key="5" onClick={props.onLogout}>
            Logout
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="4">
          <NavLink
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
            to="/auth"
          >
            Authentication
          </NavLink>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Navigation;
