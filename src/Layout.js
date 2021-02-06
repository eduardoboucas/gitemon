import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./Layout.css";

function Layout({ children, ...props }) {
  return (
    <div className="layout">
      <Header {...props} />

      <div className="constrain">{children}</div>

      <Footer />
    </div>
  );
}

export default Layout;
