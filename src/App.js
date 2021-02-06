import { Octokit } from "@octokit/rest";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { fetch as fetchFromGithub, getSignInLink } from "./lib/github";
import Game from "./Game";
import Switchboard from "./Switchboard";
import "./App.css";

function renderErrorMessage({ code, orgSlug }) {
  if (code === 403) {
    return (
      <>
        <p>You've reached the rate limiting of the GitHub API.</p>
        <p>
          To continue playing, <a href={getSignInLink()}>sign in with GitHub</a>
          .
        </p>
      </>
    );
  }

  if (code === 404) {
    return <p>The organization "{orgSlug}" does not seem to exist.</p>;
  }

  return <p>Uh-oh! Looks like something went wrong.</p>;
}

function App() {
  const [errorCode, setErrorCode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [org, setOrg] = useState();
  const [people, setPeople] = useState([]);

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const [, orgSlug] = url.pathname.split("/");

  useEffect(() => {
    const fetchDataFromGithub = async () => {
      setIsFetching(true);

      try {
        const octokit = new Octokit();
        const { org, people } = await fetchFromGithub({ octokit, orgSlug });

        setOrg(org);
        setPeople(people);
      } catch (error) {
        console.error(error);

        setErrorCode(error.status);
      } finally {
        setIsFetching(false);
      }
    };
    const fetchDataFromFunction = async (code) => {
      setIsFetching(true);

      try {
        const { data } = await axios(`/.netlify/functions/get-people`, {
          data: {
            code,
            org: orgSlug,
          },
          method: "post",
        });

        setIsAuthenticated(true);
        setOrg(data.org);
        setPeople(data.people);
      } catch (error) {
        console.error(error);

        setErrorCode(error.status);
      } finally {
        setIsFetching(false);
      }
    };

    if (orgSlug) {
      if (code) {
        fetchDataFromFunction(code);

        url.searchParams.delete("code");

        window.history.replaceState(null, null, url.toString());
      } else {
        fetchDataFromGithub();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgSlug]);

  const props = {
    isAuthenticated,
    isFetching,
    people,
    org,
    orgSlug,
  };

  if (!orgSlug) {
    return (
      <Layout {...props}>
        <Switchboard />
      </Layout>
    );
  }

  if (isFetching) {
    return (
      <Layout {...props}>
        <p>Loading...</p>
      </Layout>
    );
  }

  if (errorCode) {
    return (
      <Layout {...props} orgSlug={null}>
        {renderErrorMessage({ code: errorCode, orgSlug })}
      </Layout>
    );
  }

  if (people.length === 0) {
    return (
      <Layout {...props}>
        <p>
          Uh-oh. It looks like the organization does not have any public
          members.
        </p>
        <p>
          To load all members of an organization you're part of,{" "}
          <a href={getSignInLink()}>sign in with GitHub</a>.
        </p>
      </Layout>
    );
  }

  return (
    <Layout {...props}>
      <Game {...props} />
    </Layout>
  );
}

export default App;
