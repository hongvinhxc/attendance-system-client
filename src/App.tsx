import { useState, useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getCookie } from "helpers/token";
import { AuthContext } from "./context";
import Login from "./pages/login";
import Home from "./pages/home";
import ProfileManagement from "pages/admin/profile-management";
import Main from "components/layout/main";
import ChangePassword from "pages/admin/change-password";
import AttendanceInformation from "pages/admin/attendance-information";
import AttendanceDetail from "pages/admin/attendance-information/detail";
import WorkingTime from "pages/admin/working-time";

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useContext(AuthContext);
  let location = useLocation();

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
    setAuth(false);
    window.location.replace("/login");
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isAuth, onLogin, onLogout }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<RequireAuth><Main/></RequireAuth>}>
            <Route path="/admin/profile-management" element={<ProfileManagement />} />
            <Route path="/admin/attendance-information">
              <Route path="" element={<AttendanceInformation />}/>
              <Route path=":id" element={<AttendanceDetail />}/>
            </Route>
            <Route path="/admin/working-time" element={<WorkingTime />} />
            <Route path="/admin/change-password" element={<ChangePassword />} />
            <Route path="/admin" element={<Navigate to="/admin/profile-management" replace />} />
            <Route path="/admin/*" element={<Navigate to="/admin/profile-management" replace />} />
          </Route>
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
