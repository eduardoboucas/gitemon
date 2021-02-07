const MAX_MEMBERS = 200;

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
  const isPartialResponse = members.length > MAX_MEMBERS;
  const users = await Promise.all(
    members.map((member) => {
      if (isPartialResponse) {
        return { data: member };
      }

      return octokit.users.getByUsername({
        username: member.login,
      });
    })
  );
  const people = users.map(({ data: user }) => ({
    username: user.login,
    name: user.name,
    photoUrl: user.avatar_url,
  }));

  return {
    isPartialResponse,
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
