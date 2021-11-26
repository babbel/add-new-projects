const nock = require('nock');
const github = require('@actions/github');
const { GithubHelper } = require('../github-helper');

const githubHelper = new GithubHelper({
  client: github.getOctokit('token'),
  context: { payload: { pull_request: { id: 987 } } },
});

test('adds all projects successfully', async () => {
  nock('https://api.github.com')
    .post('/projects/columns/123/cards', { content_type: 'PullRequest', content_id: 987 })
    .reply(201)
    .post('/projects/columns/456/cards', { content_type: 'PullRequest', content_id: 987 })
    .reply(201);

  expect.assertions(1);
  await githubHelper.addProjectCards({ columnIds: [123, 456] });
  expect(nock.isDone()).toBe(true);
});

test('rejects if at least one of the requests fail', () => {
  nock('https://api.github.com')
    .post('/projects/columns/123/cards', { content_type: 'PullRequest', content_id: 987 })
    .reply(201)
    .post('/projects/columns/456/cards', { content_type: 'PullRequest', content_id: 987 })
    .reply(422, 'Wrong');

  return expect(githubHelper.addProjectCards({ columnIds: [123, 456] })).rejects.toThrow('Wrong');
});
