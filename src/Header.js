import React from "react";
import "./Header.css";

function Header({ errorCode, isFetching, isPartialResponse, org, orgSlug }) {
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

    // Getting member names involves making a request to the GitHub API for each
    // member. This doesn't work well for large organizations. For those, we only
    // get a basic set of data about members (such as the login and the avatar),
    // so the full name will not be an option. The game will adjust accordingly.
    const instructions = isPartialResponse ? (
      <sub>Summon them by their GitHub username to win 1 point.</sub>
    ) : (
      <sub>
        If you summon them by their GitHub username, you win 1 point.
        <br />
        If you know their full name, you get 5!
      </sub>
    );

    return (
      <>
        <p>Do you know the lovely people of {name}?</p>
        <p>Type their names below and see how many you can catch!</p>
        {instructions}
      </>
    );
  };

  return (
    <header className="header">
      <div className="constrain">
        <section className="nes-container is-dark with-title">
          <h1 className="title">Gitémon{name && `: ${name}`}</h1>

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
