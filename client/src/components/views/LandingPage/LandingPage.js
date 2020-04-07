import React from "react";
import Axios from "axios";

function LandingPage(props) {
  const onClickHandler = () => {
    Axios.get("/api/user/logout").then((response) => {
      if (response.data.success) {
        props.history.push("/login");
      } else {
        alert("Failed to logout");
      }
    });
  };
  return (
    <div>
      LandingPage <button onClick={onClickHandler}>Logout</button>
    </div>
  );
}

export default LandingPage;
