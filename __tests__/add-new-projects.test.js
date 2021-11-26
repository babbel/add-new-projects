const nock = require('nock');
const github = require('@actions/github');
const { addNewProjects } = require('../add-new-projects');

test('adds all projects successfully', async () => {
  nock('https://api.github.com')
    .post('/projects/columns/123/cards', { content_type: 'PullRequest', content_id: 987 })
    .reply(201)
    .post('/projects/columns/456/cards', { content_type: 'PullRequest', content_id: 987 })
    .reply(201);

  expect.assertions(1);
  await addNewProjects({
    client: github.getOctokit('token'),
    columnIds: [123, 456],
    pullRequestId: 987,
  });
  expect(nock.isDone()).toBe(true);
});

test('rejects if at least one of the requests fail', () => {
  nock('https://api.github.com')
    .post('/projects/columns/123/cards', { content_type: 'PullRequest', content_id: 987 })
    .reply(201)
    .post('/projects/columns/456/cards', { content_type: 'PullRequest', content_id: 987 })
    .reply(422, 'Wrong');

  expect(addNewProjects({
    client: github.getOctokit('token'),
    columnIds: [123, 456],
    pullRequestId: 987,
  })).rejects.toThrow('Wrong');
});
