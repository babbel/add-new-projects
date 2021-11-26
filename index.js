const core = require('@actions/core');
const github = require('@actions/github');
const { getNewProjects } = require('./new-projects');
const { GithubHelper } = require('./github_helper');

async function run() {
  try {
    const currentProjects = JSON.parse(core.getInput('current-projects', { required: true }));
    const targetProjects = JSON.parse(core.getInput('target-projects', { required: true }));
    const token = core.getInput('github-token', { required: true });
    const octokit = github.getOctokit(token);

    const newProjects = getNewProjects(currentProjects, targetProjects);
    const githubHelper = new GithubHelper({
      client: octokit,
      context: github.context,
    });
    await githubHelper.assignToProjects({
      columnName: core.getInput('column-name', { required: true }),
      newProjects,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
