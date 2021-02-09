import React from "react";
import PixelatedImage from "./PixelatedImage";
import "./People.css";

function People({ correctAnswers, people }) {
  return (
    <div className="people">
      {people.map((person, index) => {
        const isRevealed = correctAnswers.includes(index);

        return (
          <div className="person-container" key={person.username}>
            <div className="nes-container is-rounded person">
              <div className="person-avatar-wrapper">
                {isRevealed ? (
                  <a
                    href={`https://github.com/${person.username}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img
                      alt=""
                      className="person-avatar"
                      src={person.photoUrl}
                      title={person.username}
                    />
                  </a>
                ) : (
                  <PixelatedImage
                    className="person-avatar-placeholder"
                    intrinsicSize={10}
                    url={person.photoUrl}
                    width={60}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default People;
