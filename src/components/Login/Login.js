import React, { Fragment, useState, useCallback } from "react";

import { Card, Select, Input, Form, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import classes from "./Login.module.css";
import Authenticate from "./Authenticate";

const Login = (props) => {
  const { Option } = Select;

  const onFinish = (values) => {
    props.onLogin(values.email, values.password, values.rentalpoint);
  };

  return (
    <Card>
      <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item name="rentalpoint" rules={[{ required: true, message: "Please select a rentalpoint!" }]}>
          <Select placeholder="Rentalpoint">
            {props.rentalpoints.map((rentalpoint) => (
              <Option key={rentalpoint.id} value={rentalpoint.key}>
                {rentalpoint.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="email" rules={[{ required: true, message: "Please input your Username!" }]}>
          <Input type="email" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
