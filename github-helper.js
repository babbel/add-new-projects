exports.GithubHelper = class {
  constructor({ client, context }) {
    this.client = client;
    this.context = context;
  }

  async assignToProjects({ columnName, newProjects }) {
    const allProjects = await this.fetchProjects();
    const columnIds = allProjects
      .map((project) => project.node) // remove top-level "node" attribute
      .filter(({ name: projectName }) => newProjects.includes(projectName))
      .map(({ columns: { edges: columns } }) => (
        columns.find((column) => column.node.name === columnName)
          .node
          .databaseId
      ));
    await this.addProjectCards({ columnIds });
  }

  async fetchProjects({ results, cursor } = { results: [] }) {
    // A limit is required, and 10 or fewer columns per project board seems reasonable
    const maxColumns = 10;
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
                columns(first: ${maxColumns}) {
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

  async addProjectCards({ columnIds }) {
    for (const columnId of columnIds) {
      // eslint-disable-next-line no-await-in-loop
      await this.client.rest.projects.createCard({
        column_id: columnId,
        content_id: this.context.payload.pull_request.id,
        content_type: 'PullRequest',
      });
    }
  }
};
