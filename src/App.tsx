import { useState } from "react";
import { AuthContext } from "./context";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Admin from "pages/admin";
import 'antd/dist/antd.less';

function App() {
  let token = getToken();
  const [isAuth, setAuth] = useState(token !== null);

  function onLogin() {
    setAuth(true);
    if (window.location.pathname !== "/login") {
      window.location.reload();
    } else {
      window.location.replace("/");
    }
  }

  function onLogout() {
    localStorage.removeItem("token");
    setAuth(false);
  }

  function getToken() {
    let token = localStorage.getItem("token");
    // if (!token && !["/login", "/"].includes(window.location.pathname)) {
    //   window.location.replace("/login");
    // }
    return token;
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isAuth, onLogin, onLogout }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
