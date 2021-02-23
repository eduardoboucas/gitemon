import React, { useState } from "react";
import "./Switchboard.css";

function Switchboard() {
  const [orgSlug, setOrgSlug] = useState("");
  const navigate = (event) => {
    event.preventDefault();

    window.location.href = `/${orgSlug}`;
  };
  const ConditionalLink = ({ condition, link, children }) => {
    if (condition) {
      return (
        <a href={link} className="nes-btn is-primary switchboard-control">
          {children}
        </a>
      );
    }

    return (
      <span className="nes-btn is-primary switchboard-control is-disabled">
        {children}
      </span>
    );
  };

  return (
    <div className="constrain">
      <form onSubmit={navigate}>
        <div className="switchboard-controls">
          <div>
            <label className="switchboard-control" htmlFor="org-slug">
              github.com/
            </label>
            <input
              autoComplete={false}
              id="org-slug"
              type="text"
              className="nes-input switchboard-control switchboard-input"
              onChange={(event) => setOrgSlug(event.target.value)}
              value={orgSlug}
            />
          </div>

          <div className="switchboard-buttons">
            <ConditionalLink condition={orgSlug} link={`/${orgSlug}`}>
              Catch 'em all
            </ConditionalLink>
            <ConditionalLink condition={orgSlug} link={`/${orgSlug}/random`}>
              Catch one randomly
            </ConditionalLink>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Switchboard;
