exports.getNewProjects = (currentProjects, targetProjectNames) => {
  const currentProjectNames = currentProjects.map((project) => project.node.project.name);

  return targetProjectNames.filter((p) => !currentProjectNames.includes(p));
};
