const github = require('@actions/github');
const { GithubHelper } = require('../github_helper');
const { data: { repository: { projects: { edges: page1 } } } } = require('./fetch-page1.json');
const { data: { repository: { projects: { edges: page2 } } } } = require('./fetch-page2.json');

const githubHelper = new GithubHelper({
  client: github.getOctokit('token'),
  context: { payload: { pull_request: { id: 987 } } },
});

test('fetches projects, filters them, and adds project cards for each', async () => {
  expect.assertions(2);
  const fetchProjects = jest.spyOn(githubHelper, 'fetchProjects').mockImplementation(() => page1.concat(page2));
  const addProjectCards = jest.spyOn(githubHelper, 'addProjectCards').mockImplementation(() => {});

  await githubHelper.assignToProjects({ columnName: 'TODO', newProjects: ['client-info', 'home'] });
  expect(fetchProjects).toHaveBeenCalled();
  expect(addProjectCards).toHaveBeenCalledWith({ columnIds: [321, 1234] });
});
