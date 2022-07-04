import { get, post } from "./base";

const login = (username: String, password: String) => {
  let body = {
    username,
    password,
  };
  let path = "auth/login";
  let res = post(path, body);
  return res;
};

const changePassword = (
  password: String,
  newPassword: String
) => {
  let body = {
    password,
    newPassword
  };
  let path = "auth/change-password";
  let res = post(path, body);
  return res;
};

export { login, changePassword };
