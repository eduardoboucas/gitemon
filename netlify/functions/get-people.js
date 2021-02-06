const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");
const { Octokit } = require("@octokit/rest");
const { fetch: fetchFromGithub } = require("../../src/lib/github");

exports.handler = async (event, context) => {
  try {
    const { code, org: orgSlug } = JSON.parse(event.body);
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
    const { org, people } = await fetchFromGithub({ octokit, orgSlug });

    return {
      statusCode: 200,
      body: JSON.stringify({ org, people }),
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
