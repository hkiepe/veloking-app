import React, { Fragment } from "react";

import { Layout } from "antd";

import Navigation from "./Navigation";
import classes from "./MainHeader.module.css";

const MainHeader = (props) => {
  const { Header } = Layout;

  return (
    <Fragment>
      <Header className={classes["header"]}>
        <div className="logo" />
        <Navigation
          isLoggedIn={props.isAuthenticated}
          onLogout={props.onLogout}
        />
      </Header>
    </Fragment>
  );
};

export default MainHeader;
