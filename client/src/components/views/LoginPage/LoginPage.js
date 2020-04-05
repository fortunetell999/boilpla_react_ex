//https://blog.bitsrc.io/handling-react-forms-and-validation-with-formik-and-yup-dc789fd9e485
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";

function LoginPage(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const onLoginHandler = (event) => {
    switch (event.currentTarget.id) {
      case "email":
        setEmail(event.currentTarget.value);
        break;
      case "password":
        setPassword(event.currentTarget.value);
        break;
      default:
        break;
    }
  };
  const onSubmitHandler = (event) => {
    event.preventDefault();
    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        props.history.push("/");
      } else {
        alert("error");
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
          onChange={onLoginHandler}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name=""
          id="password"
          value={Password}
          onChange={onLoginHandler}
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default LoginPage;
