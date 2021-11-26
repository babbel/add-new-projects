exports.filterProjects = ({ columnName, allProjects, relevantProjects }) => (
  allProjects
    .filter((p) => relevantProjects.includes(p.node.name))
    .map((p) => (
      p
        .node
        .columns
        .edges
        .find((column) => column.node.name === columnName)
        .node
        .databaseId
    ))
);
