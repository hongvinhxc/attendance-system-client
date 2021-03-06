import { AuthContext } from "context";
import { useState, useContext } from "react";
import { message } from "antd";
import "./style.scss";
import { login } from "services/auth";

import wave from "assets/images/wave.png";
import bg from "assets/images/bg.svg";
import avatar from "assets/images/avatar.svg";

function Login() {
  const [focusU, setFocusU] = useState("");
  const [focusP, setFocusP] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const context = useContext(AuthContext);

  const onUsernameChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const onPasswordChanged = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const onBlurInput = (type: String) => {
    if (type === "username" && username.trim() === "") {
      setFocusU("");
    } else if (type === "password" && password === "") {
      setFocusP("");
    }
  };

  const onLogin = async () => {
    let res = await login(username, password);
    if (res?.status) {
      context.onLogin();
    } else {
      message.error(res.message);
    }
  };

  const onKeyPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && username.trim() !== "" && password !== "") {
      onLogin();
    }
  };

  return (
    <div className="login-body">
      <img alt="" className="wave" src={wave} />
      <div className="container">
        <div className="img">
          <img alt="" src={bg} />
        </div>
        <div className="login-content">
          <form className="form-login">
            <img alt="" src={avatar} />
            <h2 className="title">Welcome</h2>
            <div className={"input-div one " + focusU}>
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <h5>Username</h5>
                <input
                  type="text"
                  className="input"
                  value={username}
                  onFocus={() => setFocusU("focus")}
                  onBlur={() => onBlurInput("username")}
                  onChange={onUsernameChanged}
                />
              </div>
            </div>
            <div className={"input-div pass " + focusP}>
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Password</h5>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onFocus={() => setFocusP("focus")}
                  onBlur={() => onBlurInput("password")}
                  onChange={onPasswordChanged}
                  onKeyPress={onKeyPressEnter}
                />
              </div>
            </div>
            <span
              className="link"
              onClick={() =>
                message.info(
                  "Contact your company's system administrator to reset the password!"
                )
              }
            >
              Forgot Password?
            </span>
            <input
              type="button"
              className="login-btn"
              value="Login"
              onClick={onLogin}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
