import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <sub className="footer-text">
        Built by <a href="https://twitter.com/eduardoboucas">Eduardo Bouças</a>.
        Running on <a href="https://netlify.com">Netlify</a>.<br />
        <a href="/">Change organization</a>.{" "}
        <a href="https://github.com/eduardoboucas/gitemon">Edit on GitHub</a>.
      </sub>
    </footer>
  );
}

export default Footer;
