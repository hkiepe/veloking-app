import React, { Fragment, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase-config";

import classes from "./Authenticate.module.css";
import Card from "../UI/Card/Card";
import CustomButton from "../UI/Button/CustomButton";

const Authenticate = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({});

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      console.log(user);
      console.log(auth);
      const check = await updateProfile(auth.currentUser, {
        displayName: "Jane Q. User",
        photoURL: "https://example.com/jane-q-user/profile.jpg",
      });
      console.log("Check", check);
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <Fragment>
      {user ? (
        <Card className={classes.input}>
          User Logged In as {user.email}
          <br />
          <br />
          <CustomButton onClick={logout}>Sign Out</CustomButton>
        </Card>
      ) : (
        <Fragment>
          <Card className={classes.input}>
            <h1>Register</h1>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              onChange={(event) => {
                setRegisterEmail(event.target.value);
              }}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              onChange={(event) => {
                setRegisterPassword(event.target.value);
              }}
            />
            <CustomButton onClick={register}>Create User</CustomButton>
          </Card>
          {/* <Card className={classes.input}>
            <h1>Login</h1>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              onChange={(event) => {
                setLoginEmail(event.target.value);
              }}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              onChange={(event) => {
                setLoginPassword(event.target.value);
              }}
            />
            <Button onClick={login}>Login</Button>
          </Card> */}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Authenticate;
