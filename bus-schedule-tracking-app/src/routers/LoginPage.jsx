import { useContext, useState } from "react";
import { AuthContext } from "../store/auth-context";
import { Link } from "react-router-dom";
import { dummyLoginData } from "../dummyData/dummyLoginData";

import styles from "./LoginPage.module.css"

function LoginPage() {
  // Step 4: Apply the useContext hook
  const userCtx = useContext(AuthContext);
  const { loginHandler, isLoggedIn } = userCtx; // Destructure userCtx

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // State to track login error messages

  const formChangeHandler = (e) => {
    setLoginForm((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  // function that is called when user logs in
  const handleSubmit = () => {
    // call the API to login, return some auth token

    // here, we still using dummy Login data to login
    // console.log("loginForm object: ", loginForm);
    const isValidLogin = dummyLoginData.some (
        (user) => {
            return user.username === loginForm.username && user.password === loginForm.password
        }
    );

    if (isValidLogin){
        loginHandler(loginForm.username);
        setErrorMessage(""); // Clear any previous errors
    } else {
        console.error("⚠️ Invalid Username or password");
        setErrorMessage("❌ Invalid Username or password. Please try again.")
    }
  };

  return (
    <div>
      {/* <h1>Login Page</h1> */}
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {!isLoggedIn && (
          <>
            <p className= {styles.loginPageIntroText} style={{marginTop: "40px", marginBottom: "40px"}}>Please enter your Username and Password</p>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                name="username"
                onChange={formChangeHandler}
                value={loginForm.username}
                placeholder="User Name"
              />
              <input
                type="password"
                name="password"
                onChange={formChangeHandler}
                value={loginForm.password}
                placeholder="Password"
              />
              <button type="submit" onClick={handleSubmit}>
                Log in
              </button>
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
          </>
        )}

        {isLoggedIn && (
          <>
            <p>You are logged in!</p>
            <Link to="/map-main">Go to Map</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
