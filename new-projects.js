exports.getNewProjectNames = (currentProjects, targetProjectNames) => {
  const currentProjectNames = currentProjects.map((project) => project.name);

  return targetProjectNames.filter((p) => !currentProjectNames.includes(p));
};
