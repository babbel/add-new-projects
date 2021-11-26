const { filterProjects } = require('../filter');
const { data: { repository: { projects: { edges: page1 } } } } = require('./fetch-page1.json');
const { data: { repository: { projects: { edges: page2 } } } } = require('./fetch-page2.json');

test('filters the given projects by name and returns the database IDs', () => {
  expect(filterProjects({
    columnName: 'TODO',
    allProjects: page1.concat(page2),
    relevantProjects: ['credentials', 'home'],
  })).toStrictEqual([123, 1234]);
});
