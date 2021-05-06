import React, { useEffect, useState } from "react";
import { getSignInLink } from "./lib/github";
import {
  fillArray,
  getRandomNumberBetween,
  getSpaceIndexes,
  obfuscateString,
} from "./lib/utils";
import { playSound } from "./lib/sound";
import PixelatedImage from "./PixelatedImage";

import "./Random.css";

const AVATAR_MAX_SIZE = 60;
const AVATAR_NATURAL_SIZE = 300;
const AVATAR_SIZE_INCREMENT = 20;
const HINT_ACTIVE_REPO = "HINT_ACTIVE_REPO";
const HINT_AVATAR = "HINT_AVATAR";
const HINT_BIO = "HINT_BIO";
const HINT_LOCATION = "HINT_LOCATION";
const HINT_NAME = "HINT_NAME";
const HINT_SITE = "HINT_SITE";
const HINT_USERNAME = "HINT_USERNAME";
const MIN_UNREVEALED_CHARS = 3;

function Random({ isAuthenticated, org, orgSlug, person }) {
  const [attemptCount, setAttemptCount] = useState(0);
  const [avatarSize, setAvatarSize] = useState(10);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [hasWon, setHasWon] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState([]);
  const [namePositionsRevealed, setNamePositionsRevealed] = useState([]);
  const [usernamePositionsRevealed, setUsernamePositionsRevealed] = useState(
    []
  );

  useEffect(() => {
    if (!person) return;

    setNamePositionsRevealed([
      ...namePositionsRevealed,
      ...getSpaceIndexes(person.name),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person]);

  if (!person) {
    return null;
  }

  const mostActiveRepo = Object.keys(person.commitsByRepo).reduce(
    (mostActiveRepo, repo) =>
      mostActiveRepo &&
      person.commitsByRepo[mostActiveRepo] > person.commitsByRepo[repo]
        ? mostActiveRepo
        : repo,
    null
  );

  const applyHint = (hint) => {
    switch (hint) {
      case HINT_ACTIVE_REPO:
      case HINT_BIO:
      case HINT_LOCATION:
      case HINT_SITE:
        setHintsRevealed([
          { id: hintsRevealed.length, type: hint },
          ...hintsRevealed,
        ]);

        break;

      case HINT_AVATAR:
        setAvatarSize(avatarSize + AVATAR_SIZE_INCREMENT);
        setHintsRevealed([
          { id: hintsRevealed.length, type: hint },
          ...hintsRevealed,
        ]);

        break;

      case HINT_NAME:
        const namePosition = getRandomNumberBetween(
          0,
          person.name.length - 1,
          namePositionsRevealed
        );

        setHintsRevealed([
          {
            data: person.name[namePosition],
            id: hintsRevealed.length,
            type: hint,
          },
          ...hintsRevealed,
        ]);
        setNamePositionsRevealed([...namePositionsRevealed, namePosition]);

        break;

      case HINT_USERNAME:
        const usernamePosition = getRandomNumberBetween(
          0,
          person.login.length - 1,
          usernamePositionsRevealed
        );

        setHintsRevealed([
          {
            data: person.login[usernamePosition],
            id: hintsRevealed.length,
            type: hint,
          },
          ...hintsRevealed,
        ]);
        setUsernamePositionsRevealed([
          ...usernamePositionsRevealed,
          usernamePosition,
        ]);

        break;

      default:
        return;
    }
  };
  const getAvailableHints = (revealed) => {
    const typesOfHintsRevealed = revealed.map((hint) => hint.type);
    const availableHints = [
      !typesOfHintsRevealed.includes(HINT_ACTIVE_REPO) &&
        mostActiveRepo &&
        HINT_ACTIVE_REPO,
      avatarSize < AVATAR_MAX_SIZE && HINT_AVATAR,
      !typesOfHintsRevealed.includes(HINT_BIO) &&
        Boolean(person.bio) &&
        HINT_BIO,
      !typesOfHintsRevealed.includes(HINT_LOCATION) &&
        Boolean(person.location) &&
        HINT_LOCATION,
      !typesOfHintsRevealed.includes(HINT_SITE) &&
        Boolean(person.blog) &&
        HINT_SITE,
    ]
      .filter(Boolean)
      .concat(
        fillArray(
          HINT_NAME,
          person.name.length -
            namePositionsRevealed.length -
            MIN_UNREVEALED_CHARS
        )
      )
      .concat(
        fillArray(
          HINT_USERNAME,
          person.login.length -
            usernamePositionsRevealed.length -
            MIN_UNREVEALED_CHARS
        )
      );

    return availableHints;
  };
  const getScore = () => {
    const possibleHints = getAvailableHints([]).length;
    const usedHints = hintsRevealed.length;
    const score = Math.max(
      1,
      100 - Math.floor((usedHints * 100) / possibleHints)
    );

    return score;
  };
  const requestHint = () => {
    const hintIndex = getRandomNumberBetween(0, availableHints.length - 1);
    const hint = availableHints[hintIndex];

    console.log("Applying hint:", hint);

    applyHint(hint);
    playSound(0);
    setAttemptCount(attemptCount + 1);
  };

  const availableHints = getAvailableHints(hintsRevealed);

  const handleAnswer = (event) => {
    event.preventDefault();

    const candidateAnswer = currentAnswer.toLowerCase();
    const isRightAnswer =
      candidateAnswer === person.name.toLowerCase() ||
      candidateAnswer === person.login.toLowerCase();

    if (isRightAnswer) {
      playSound(2);
      setHasWon(true);
    }

    setCurrentAnswer("");
  };

  const displayHint = (hint) => {
    if (hint.type === HINT_ACTIVE_REPO) {
      return (
        <>
          Recently active in{" "}
          <a href={`https://github.com/${mostActiveRepo}`}>{mostActiveRepo}</a>
        </>
      );
    }

    if (hint.type === HINT_AVATAR) {
      return <>Enhanced avatar resolution</>;
    }

    if (hint.type === HINT_BIO) {
      return (
        <>
          Described as <em>«{person.bio}»</em>
        </>
      );
    }

    if (hint.type === HINT_LOCATION) {
      return <>Based in {person.location}</>;
    }

    if (hint.type === HINT_NAME) {
      return (
        <>
          Revealed character in name: <em>{hint.data}</em>
        </>
      );
    }

    if (hint.type === HINT_SITE) {
      if (
        person.blog.indexOf("http://") !== 0 &&
        person.blog.indexOf("https://") !== 0
      ) {
        person.blog = "https://" + person.blog;
      }
      return (
        <>
          Has a website at <a href={person.blog}>{person.blog}</a>
        </>
      );
    }

    if (hint.type === HINT_USERNAME) {
      return (
        <>
          Revealed character in username: <em>{hint.data}</em>
        </>
      );
    }
  };

  const displayName = hasWon
    ? person.name
    : obfuscateString(person.name, namePositionsRevealed);
  const displayUsername = hasWon
    ? person.login
    : obfuscateString(person.login, usernamePositionsRevealed);

  return (
    <div>
      <h1>{displayName}</h1>
      <p>github.com/{displayUsername}</p>

      <div className="person-data">
        <div>
          <div className="nes-container is-rounded person">
            <PixelatedImage
              intrinsicSize={hasWon ? AVATAR_NATURAL_SIZE : avatarSize}
              url={person.avatar_url}
              width={AVATAR_NATURAL_SIZE}
            />
          </div>
        </div>
        <div className="hints-wrapper">
          <div
            className={`nes-container with-title is-rounded is-centered activity`}
          >
            {!hasWon && (
              <p className="title">Hints ({availableHints.length} left)</p>
            )}

            {hasWon && (
              <div className="blink score-wrapper">
                <p>
                  <i className="nes-icon trophy is-large"></i>
                </p>
                <h2>Congratulations!</h2>
                <p>
                  You caught{" "}
                  <a href={`https://github.com/${person.login}`}>
                    @{person.login}
                  </a>{" "}
                  with a score of <strong>{getScore()}</strong>.
                </p>
              </div>
            )}

            {!hasWon && (
              <div className="hints">
                <ul className="nes-list is-disc">
                  {hintsRevealed.map((hint) => (
                    <li className="hint blink" key={hint.id}>
                      {displayHint(hint)}
                    </li>
                  ))}
                </ul>
                <button
                  className={`nes-btn is-primary ${
                    availableHints.length === 0 ? "is-disabled" : ""
                  }`}
                  disabled={availableHints.length === 0}
                  onClick={requestHint}
                  type="button"
                >
                  Help me!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!hasWon && (
        <form className="person-form" onSubmit={handleAnswer}>
          <div className="input-wrapper">
            <input
              className="input nes-input"
              disabled={hasWon}
              onChange={(event) => setCurrentAnswer(event.target.value)}
              placeholder="Type a username or full name"
              value={currentAnswer}
            />

            <button
              disabled={hasWon}
              type="submit"
              className={`confirm-button nes-btn is-success ${
                hasWon ? "is-disabled" : ""
              }`}
            >
              GO
            </button>
          </div>
        </form>
      )}

      <div className="end-controls">
        <a href={`/${orgSlug}/random`} className="nes-btn is-primary">
          Catch another member of {org.name}
        </a>
      </div>

      {!isAuthenticated && !hasWon && (
        <sub>
          <strong>NOTE</strong>: Only public members of the organization will
          appear. To load all members of an organization you're part of,{" "}
          <a href={getSignInLink()}>sign in with GitHub</a> and click the{" "}
          <em>Grant</em> button next to the organization name.
        </sub>
      )}
    </div>
  );
}

export default Random;
