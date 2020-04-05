import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";

function RegisterPage(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const onRegisterHandler = (event) => {
    switch (event.currentTarget.id) {
      case "email":
        setEmail(event.currentTarget.value);
        break;
      case "name":
        setName(event.currentTarget.value);
        break;
      case "password":
        setPassword(event.currentTarget.value);
        break;
      case "confirmPassword":
        setConfirmPassword(event.currentTarget.value);
        break;

      default:
        break;
    }
  };
  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (Password !== ConfirmPassword) {
      return alert("Password !== ConfirmPassword");
    }
    let body = {
      email: Email,
      name: Name,
      password: Password,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        props.history.push("/login");
      } else {
        alert("err");
      }
    });
  };
  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name=""
          id="email"
          value={Email}
          onChange={onRegisterHandler}
        />
        <label htmlFor="name">Name</label>
        <input
          type="name"
          name=""
          id="name"
          value={Name}
          onChange={onRegisterHandler}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name=""
          id="password"
          value={Password}
          onChange={onRegisterHandler}
        />
        <input
          type="password"
          name=""
          id="confirmPassword"
          value={ConfirmPassword}
          onChange={onRegisterHandler}
        />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default RegisterPage;
