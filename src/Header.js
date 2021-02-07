import React from "react";
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
    return <p>Loading GitHub organization...</p>;
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
        <p>Type their GitHub usernames and see how many you can catch!</p>
        <sub>
          Win points for every person you summon. The faster you are, the more
          points you get!
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
            {photoUrl && <img alt="" className="org-avatar" src={photoUrl} />}
            <i className="nes-pokeball"></i>
          </div>

          {isFetching ? renderFetching() : renderOrg()}
        </section>
      </div>
    </header>
  );
}

export default Header;
