exports.GithubHelper = class {
  constructor({ client, context }) {
    this.client = client;
    this.context = context;
  }

  async fetchProjects({ results, cursor } = { results: [] }) {
    const query = `
      query($cursor: String) {
        repository(owner: "${this.context.repo.owner}", name: "${this.context.repo.repo}") {
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
    const { repository: { projects } } = await this.client.graphql(query, { cursor });
    results.push(...projects.edges);

    if (projects.pageInfo.hasNextPage) {
      await this.fetchProjects({ results, cursor: projects.pageInfo.endCursor });
    }

    return results;
  }
};
