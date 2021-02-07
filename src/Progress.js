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
          NOTE: Only public members of the organization will appear. To load all
          members of an organization you're part of,{" "}
          <span>
            <a href={getSignInLink()}>sign in with GitHub</a>
          </span>
          .
        </sub>
      )}
    </div>
  );
}

export default Progress;
