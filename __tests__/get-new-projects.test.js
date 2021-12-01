const { getNewProjectNames } = require('../new-projects');

const fooproj = { name: 'foo' };
const barproj = { name: 'bar' };

test('no new projects when current and target are both empty', async () => {
  expect(getNewProjectNames([], [])).toStrictEqual([]);
});

test('no new projects when target is empty', async () => {
  expect(getNewProjectNames([fooproj], [])).toStrictEqual([]);
});

test('new projects when current is empty', async () => {
  expect(getNewProjectNames([], ['foo'])).toStrictEqual(['foo']);
});

test('new projects are what is in target but not current', async () => {
  expect(getNewProjectNames([fooproj, barproj], ['bar', 'baz'])).toStrictEqual(['baz']);
});
