export const fetch = async ({ octokit, orgSlug }) => {
  const { data: org } = await octokit.orgs.get({
    org: orgSlug,
  });
  const orgObject = {
    description: org.description,
    name: org.name,
    photoUrl: org.avatar_url,
  };
  const members = await octokit.paginate("GET /orgs/{org}/members", {
    org: orgSlug,
  });
  const people = members.map((member) => ({
    username: member.login.toLowerCase(),
    photoUrl: member.avatar_url,
  }));

  return {
    org: orgObject,
    people,
  };
};

export const getSignInLink = () =>
  `https://github.com/login/oauth/authorize?client_id=${
    process.env.REACT_APP_GITHUB_APP_CLIENT_ID
  }&scope=user,repo&redirect_uri=${encodeURIComponent(
    window.location.origin + window.location.pathname
  )}`;
