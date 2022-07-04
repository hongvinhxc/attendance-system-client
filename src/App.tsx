import { useState, useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getCookie } from "helpers/token";
import { AuthContext } from "./context";
import Login from "./pages/login";
import Home from "./pages/home";
import Admin from "pages/admin";

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useContext(AuthContext);
  let location = useLocation();
  console.log(auth);
  

  if (!auth.isAuth) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  let token = getCookie("csrf_access_token");
  console.log(token);
  
  
  const [isAuth, setAuth] = useState(token !== "");

  function onLogin() {
    setAuth(true);
    if (window.location.pathname !== "/login") {
      window.location.reload();
    } else {
      window.location.replace("/admin");
    }
  }

  function onLogout() {
    localStorage.removeItem("token");
    setAuth(false);
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isAuth, onLogin, onLogout }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
