const core = require('@actions/core');
const github = require('@actions/github');
const { getNewProjects } = require('./new-projects');
const { addNewProjects } = require('./add-new-projects');
const { fetchProjects } = require('./fetch');
const { filterProjects } = require('./filter');

async function run() {
  try {
    const currentProjects = JSON.parse(core.getInput('current-projects', { required: true }));
    const targetProjects = JSON.parse(core.getInput('target-projects', { required: true }));
    const token = core.getInput('github-token', { required: true });
    const octokit = github.getOctokit(token);

    const newProjects = getNewProjects(currentProjects, targetProjects);
    const allProjects = await fetchProjects({
      client: octokit,
      repo: github.context.repo,
    });
    const columnIds = filterProjects({
      columnName: core.getInput('column-name', { required: true }),
      allProjects,
      relevantProjects: newProjects,
    });

    await addNewProjects({
      client: octokit,
      columnIds,
      pullRequestId: github.context.payload.pull_request.id,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
