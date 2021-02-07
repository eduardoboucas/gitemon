import React, { useEffect, useState } from "react";
import { formatTime } from "./lib/utils";
import Progress from "./Progress";

import "./Game.css";

function Game({ isAuthenticated, isFetching, people }) {
  const [isSoundEnabled, toggleSound] = useState(true);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [fullMatches, setFullMatches] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const correctAnswersCount = correctAnswers.length;
  const hasFinished =
    people.length > 0 && correctAnswersCount === people.length;

  useEffect(() => {
    const timerId = setInterval(() => {
      if (hasFinished) {
        clearInterval(timerId);

        return;
      } else if (!isFetching) {
        setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);

    return () => clearInterval(timerId);
  });

  const sound1 = new Audio("/sound/partial.mp3");
  const sound2 = new Audio("/sound/full.mp3");
  const sound3 = new Audio("/sound/win.mp3");

  const handleAnswer = (event) => {
    const candidateAnswer = currentAnswer.toUpperCase();

    let newCorrectAnswers = [];
    let newFullMatches = [];

    people.forEach(({ name }, index) => {
      if (
        candidateAnswer === name.toUpperCase() &&
        correctAnswers.indexOf(index) === -1
      ) {
        newCorrectAnswers.push(index);
        newFullMatches.push(index);
      }
    });

    if (newCorrectAnswers.length === 0) {
      people.forEach(({ username }, index) => {
        if (
          candidateAnswer === username.toUpperCase() &&
          correctAnswers.indexOf(index) === -1
        ) {
          newCorrectAnswers.push(index);
        }
      });
    }

    let sound;

    if (newCorrectAnswers.length > 0) {
      const newCorrectAnswersState = [...newCorrectAnswers, ...correctAnswers];

      setCorrectAnswers(newCorrectAnswersState);
      setFullMatches([...fullMatches, ...newFullMatches]);

      if (newCorrectAnswersState.length === people.length) {
        sound = sound3;
      } else if (newFullMatches.length > 0) {
        sound = sound2;
      } else {
        sound = sound1;
      }

      if (isSoundEnabled) {
        sound.play();
      }
    }

    setCurrentAnswer("");
    event.preventDefault();
  };

  const score = correctAnswers.reduce(
    (score, index) => score + (fullMatches.includes(index) ? 5 : 1),
    0
  );

  return (
    <>
      <div className="controls">
        {!hasFinished && (
          <>
            <form className="form" onSubmit={handleAnswer}>
              <div className="input-wrapper">
                <input
                  className="input nes-input"
                  onChange={(event) => setCurrentAnswer(event.target.value)}
                  placeholder="Type a name"
                  value={currentAnswer}
                />

                <button
                  type="submit"
                  className="confirm-button nes-btn is-primary"
                >
                  GO
                </button>
              </div>
            </form>

            <h2>
              SCORE: {score} <i className="nes-icon coin"></i>
            </h2>
          </>
        )}
      </div>

      {hasFinished && (
        <>
          <p>
            <i className="nes-icon trophy is-large"></i>
          </p>
          <h2>Congratulations!</h2>
          <p>
            You finished in <strong>{formatTime(timeElapsed)}</strong> with a
            score of <strong>{score}</strong>.
          </p>
        </>
      )}

      {correctAnswers.length > 0 && (
        <div className="table-wrapper">
          <table className="answers nes-table is-bordered is-centered">
            <tbody>
              {correctAnswers.map((index, position) => {
                const { name, photoUrl, username } = people[index];
                const isFullMatch = fullMatches.indexOf(index) !== -1;

                return (
                  <tr className="answer" key={username}>
                    <td>
                      <span className="answer-animation">
                        #{correctAnswers.length - position}
                      </span>
                    </td>
                    <td>
                      <img
                        className="answer-animation answer-photo"
                        width={60}
                        height={60}
                        src={photoUrl}
                        alt=""
                      />
                    </td>
                    <td>
                      <span className="answer-animation answer-name">
                        {name}
                        {isFullMatch && <i className="icon nes-icon star"></i>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isFetching && !hasFinished && (
        <Progress
          isAuthenticated={isAuthenticated}
          correctAnswers={correctAnswers}
          people={people}
          timeElapsed={timeElapsed}
        />
      )}

      <div className="toggle-sound">
        <label>
          <input
            checked={isSoundEnabled}
            className="nes-checkbox"
            onChange={(event) => toggleSound(event.target.checked)}
            type="checkbox"
          />
          <span>Sound</span>
        </label>
      </div>
    </>
  );
}

export default Game;
