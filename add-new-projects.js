exports.addNewProjects = async ({ client, columnIds, pullRequestId }) => {
  // process projects sequentially to reduce risk of throttling by GitHub API
  for (const columnId of columnIds) {
    // eslint-disable-next-line no-await-in-loop
    await client.rest.projects.createCard({
      column_id: columnId,
      content_id: pullRequestId,
      content_type: 'PullRequest',
    });
  }
};
