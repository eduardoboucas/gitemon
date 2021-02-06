import React from "react";
import { formatTime } from "./lib/utils";
import "./Progress.css";

const { getSignInLink } = require("./lib/github");

function Progress({ isAuthenticated, correctAnswers, timeElapsed, people }) {
  return (
    <div className="progress-wrapper">
      <div className="progress-text">
        <span>{formatTime(timeElapsed)}</span>
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
