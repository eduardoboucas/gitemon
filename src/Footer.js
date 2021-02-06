import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <sub className="footer-text">
        Built by <a href="https://eduardoboucas.com">Eduardo Bouças</a>. Running
        on <a href="https://netlify.com">Netlify</a>.<br />
        Fork me <a href="https://github.com/eduardoboucas/pokehub">on GitHub</a>
        .
      </sub>
    </footer>
  );
}

export default Footer;
