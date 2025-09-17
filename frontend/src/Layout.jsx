// src/Layout.jsx
import React from "react";
import SideBar from "./components/layouts/SideBar";
import NavBar from "./components/layouts/NavBar";
import ThemeSetting from "./components/layouts/ThemeSetting";
import Footer from "./components/layouts/Footer";
import useAuth from "./components/accounts/useAuth";
import useIdleLogout from "./hooks/useIdleLogout";

const Layout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();

  // ✅ Trigger logout if user is idle for 15 minutes
  useIdleLogout(isAuthenticated ? logout : () => {}, 15 * 60 * 1000); // 15 mins

  return (
    <div className="container-scroller">
      <SideBar />
      <div className="container-fluid page-body-wrapper">
        <ThemeSetting />
        <NavBar />
        <div className="main-panel">
          <div className="content-wrapper pb-0">{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
