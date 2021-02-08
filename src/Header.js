import React from "react";
import PixelatedImage from "./PixelatedImage";
import "./Header.css";

function Header({ errorCode, isFetching, org, orgSlug }) {
  const name = isFetching ? null : (org && org.name) || orgSlug;
  let { photoUrl } = org || {};

  if (photoUrl) {
    const photoUrlObject = photoUrl && new URL(photoUrl);

    photoUrlObject.searchParams.set("s", "16");

    photoUrl = photoUrlObject.toString();
  }

  const renderFetching = () => {
    return <p>Hold tight</p>;
  };

  const renderOrg = () => {
    if (errorCode) {
      return <p>Uh-oh!</p>;
    }

    if (!name) {
      return <p>Choose a GitHub organization</p>;
    }

    return (
      <>
        <p>How well do you know the lovely people of {name}?</p>
        <sub>
          Type their GitHub usernames and see how many you can catch.
          <br />
          The faster you are, the more points you get!
        </sub>
      </>
    );
  };

  return (
    <header className="header">
      <div className="constrain">
        <section className="nes-container is-dark with-title">
          <h1 className="title">Gitémon</h1>

          <div className="header-icons">
            {photoUrl && (
              <PixelatedImage intrinsicSize={16} url={photoUrl} width={84} />
            )}
            <i className="nes-pokeball"></i>
          </div>

          {isFetching ? renderFetching() : renderOrg()}
        </section>
      </div>
    </header>
  );
}

export default Header;
