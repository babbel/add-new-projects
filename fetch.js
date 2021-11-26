// Adapted from https://github.com/octokit/graphql.js/issues/61#issuecomment-643392492
const fetchProjects = async ({ client, repo }, { results, cursor } = { results: [] }) => {
  const query = `
    query($cursor: String) {
      repository(owner: "${repo.owner}", name: "${repo.repo}") {
        projects(first: 100, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              name
              columns(first: 10) {
                edges {
                  node {
                    databaseId
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const { repository: { projects } } = await client.graphql(query, { cursor });
  results.push(...projects.edges);

  if (projects.pageInfo.hasNextPage) {
    await fetchProjects({ client, repo }, { results, cursor: projects.pageInfo.endCursor });
  }

  return results;
};

exports.fetchProjects = fetchProjects;
