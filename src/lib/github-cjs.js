const MAX_MEMBERS = 200;

module.exports.fetch = async ({ octokit, orgSlug }) => {
  const { data: org } = await octokit.orgs.get({
    org: orgSlug,
  });
  const orgObject = {
    description: org.description,
    name: org.name,
    photoUrl: org.avatar_url,
  };
  const options = octokit.orgs.listMembers.endpoint.merge({
    org: orgSlug,
    per_page: 100,
  });
  const members = await octokit.paginate(options);
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

module.exports.getSignInLink = () =>
  `https://github.com/login/oauth/authorize?client_id=874c43adb13e94ceeab0&scope=user,repo&redirect_uri=${encodeURIComponent(
    window.location.origin + window.location.pathname
  )}`;
