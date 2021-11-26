const nock = require('nock');
const github = require('@actions/github');
const { fetchProjects } = require('../fetch');
const page1 = require('./fetch-page1.json');
const page2 = require('./fetch-page2.json');

test('fetches all projects with pagination', async () => {
  nock('https://api.github.com')
    .post('/graphql', /"variables":{}/)
    .reply(200, page1)
    .post('/graphql', /"variables":{"cursor":"Y3Vyc29yOnYyOpHOALVY2A=="}/)
    .reply(200, page2);

  const result = await fetchProjects({
    client: github.getOctokit('token'),
    repo: { owner: 'babbel', repo: 'foo' },
  });
  const { data: { repository: { projects: { edges: projectsPage1 } } } } = page1;
  const { data: { repository: { projects: { edges: projectsPage2 } } } } = page2;
  expect(result).toStrictEqual(projectsPage1.concat(projectsPage2));
});
