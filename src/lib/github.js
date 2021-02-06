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
  const users = await Promise.all(
    members.map((member) =>
      octokit.users.getByUsername({
        username: member.login,
      })
    )
  );
  const people = users.map(({ data: user }) => ({
    username: user.login,
    name: user.name,
    photoUrl: user.avatar_url,
  }));

  return {
    org: orgObject,
    people,
  };
};

export const getSignInLink = () =>
  `https://github.com/login/oauth/authorize?client_id=874c43adb13e94ceeab0&scope=user,repo&redirect_uri=${encodeURIComponent(
    window.location.origin + window.location.pathname
  )}`;
