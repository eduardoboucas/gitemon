import React from "react";
import { getSignInLink } from "./lib/github";
import { formatTime } from "./lib/utils";
import "./Progress.css";

function Progress({
  authenticatedUser,
  correctAnswers,
  elapsedSeconds,
  people,
}) {
  const isAuthenticated = Boolean(authenticatedUser);

  return (
    <div className="progress-wrapper">
      <div className="progress-text">
        <span>{formatTime(elapsedSeconds)}</span>
        <span>
          {correctAnswers.length} of {people.length}
        </span>
      </div>

      <progress
        className="nes-progress"
        value={correctAnswers.length}
        max={people.length}
      ></progress>

      {!isAuthenticated && (
        <sub>
          <strong>NOTE</strong>: Only public members of the organization are
          counted. To load all members of an organization you're part of,{" "}
          <a href={getSignInLink()}>sign in with GitHub</a> and click the{" "}
          <em>Grant</em> button next to the organization name.
        </sub>
      )}
    </div>
  );
}

export default Progress;
