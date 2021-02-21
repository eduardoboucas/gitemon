import { Octokit } from "@octokit/rest";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import {
  fetchPeople as fetchPeopleFromGithub,
  fetchPerson as fetchPersonFromGithub,
  getSignInLink,
} from "./lib/github";
import Game from "./Game";
import Random from "./Random";
import Switchboard from "./Switchboard";
import "./App.css";

function renderErrorMessage({ code, orgSlug }) {
  if (code === 403) {
    return (
      <>
        <p>You've reached the limit of unauthorized API requests.</p>
        <p>To continue playing, sign in with your GitHub account.</p>
        <br />
        <a className="nes-btn is-primary" href={getSignInLink()}>
          Sign In
        </a>
      </>
    );
  }

  if (code === 404) {
    return <p>The organization "{orgSlug}" does not seem to exist.</p>;
  }

  return <p>Uh-oh! Looks like something went wrong.</p>;
}

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [org, setOrg] = useState();
  const [people, setPeople] = useState([]);
  const [person, setPerson] = useState();

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const [, orgSlug, action] = url.pathname.split("/");

  useEffect(() => {
    const fetchDataFromGithub = async () => {
      setIsFetching(true);

      try {
        const octokit = new Octokit();
        const { org, people } = await fetchPeopleFromGithub({
          octokit,
          orgSlug,
        });

        setOrg(org);
        setPeople(people);

        if (action === "random") {
          const personIndex = Math.floor(Math.random() * (people.length - 1));
          const { username } = people[personIndex];
          const person = await fetchPersonFromGithub({
            octokit,
            orgSlug,
            username,
          });

          setPerson(person);
        }
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

        setAuthenticatedUser(data.authenticatedUser);
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

  useEffect(() => {
    if (org) {
      document.title = `Gitémon: ${org.name}`;
    }
  }, [org]);

  const props = {
    authenticatedUser,
    errorCode,
    isFetching,
    people,
    person,
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
        <p>Loading data from GitHub...</p>
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

  if (action === "random") {
    return (
      <Layout {...props}>
        <Random {...props} />
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
