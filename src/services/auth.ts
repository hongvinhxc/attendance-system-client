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

const logout = () => {
  let path = "auth/logout";
  let res = get(path);
  return res;
};

const changePassword = (password: String, new_password: String) => {
  let body = {
    password,
    new_password,
  };
  let path = "auth/change-password";
  let res = post(path, body);
  return res;
};

export { login, logout, changePassword };
