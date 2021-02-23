export const fetchPeople = async ({ octokit, orgSlug }) => {
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
    id: member.id,
    username: member.login.toLowerCase(),
    photoUrl: member.avatar_url,
  }));

  return {
    org: orgObject,
    people,
  };
};

export const fetchPerson = async ({ octokit, orgSlug, username }) => {
  const { data: user } = await octokit.users.getByUsername({
    username,
  });
  const { data: commitData } = await octokit.search.commits({
    order: "desc",
    per_page: 100,
    q: `author:${username} org:${orgSlug}`,
    sort: "committer-date",
  });
  const commitsByRepo = commitData.items.reduce(
    (result, commit) => ({
      ...result,
      [commit.repository.full_name]:
        (result[commit.repository.full_name] || 0) + 1,
    }),
    {}
  );

  return { ...user, commitsByRepo };
};

export const getSignInLink = () =>
  `https://github.com/login/oauth/authorize?client_id=${
    process.env.REACT_APP_GITHUB_APP_CLIENT_ID
  }&scope=user,repo&redirect_uri=${encodeURIComponent(
    window.location.origin + window.location.pathname
  )}`;
