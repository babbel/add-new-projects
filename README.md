# remove-stale-projects Javascript action

Github Action to determine stale projects for a pull request and remove them.

## Background

We are using Github projects to organize our daily work.
We want pull requests to be assigned to a project depending on which subsystems are being changed.
The workflow is as follows:

1. Derive the target projects from the changes in the pull request.
2. Determine the projects a pull request is currently assigned to
   (another action, [`babbel/current-projects`](https://github.com/babbel/current-projects))
3. Determine stale projects and remove them (another action, [`babbel/remove-stale-projects`](https://github.com/babbel/remove-stale-projects))
4. Determine new projects and add them (this action)

## Inputs

| Name                   | Description                                                   | Type         | Required? | Default |
|------------------------|---------------------------------------------------------------|--------------|-----------|---------|
| `column-name`          | Name of column in the project board to create card on         | `string`     | YES       | n/a     |
| `current-projects`     | List of projects the given pull request is assigned to        | `JSON array` | YES       | n/a     |
| `github-token`         | GitHub token used to create an authenticated client           | `string`     | NO        | `${{ github.token }}` |
| `target-project-names` | List of project names the given pull request should be assigned to | `JSON array` | YES       | n/a     |
