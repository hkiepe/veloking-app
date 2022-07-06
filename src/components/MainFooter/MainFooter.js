import React from "react";
import moment from "moment";

import { Layout } from "antd";
const { Footer } = Layout;

const MainFooter = (props) => {
  return (
    <Footer style={{ textAlign: "center" }}>
      Veloking App ©{moment().year()} v0.1
      <br /> Made with <span style={{ color: "rgb(255, 255, 255)" }}>&#10084;</span> by Henrik Kiepe
    </Footer>
  );
};

export default MainFooter;
