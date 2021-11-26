exports.getNewProjects = (currentProjects, targetProjects) => {
  const currentProjectNames = currentProjects.map((project) => project.node.project.name);

  return targetProjects.filter((p) => !currentProjectNames.includes(p));
};
