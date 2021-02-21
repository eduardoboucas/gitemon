const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");
const { Octokit } = require("@octokit/rest");
const {
  fetchPeople: fetchPeopleFromGithub,
  fetchPerson: fetchPersonFromGithub,
} = require("../../src/lib/github-cjs");

exports.handler = async (event, context) => {
  try {
    const { code, org: orgSlug, person: personId } = JSON.parse(event.body);
    const auth = createOAuthAppAuth({
      clientId: process.env.GITHUB_APP_CLIENT_ID,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
    });
    const { token } = await auth({
      type: "token",
      code,
    });
    const octokit = new Octokit({
      auth: token,
    });
    const { authenticatedUser, org, people } = await fetchPeopleFromGithub({
      octokit,
      orgSlug,
    });

    const response = { authenticatedUser, org, people };

    if (personId) {
      const username =
        personId === "random"
          ? people[Math.floor(Math.random() * (people.length - 1))].username
          : personId;
      const user = await fetchPersonFromGithub({ octokit, orgSlug, username });

      response.person = user;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
    };
  }
};
