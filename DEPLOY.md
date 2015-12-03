We deploy this application on Cloud Foundry using continuous deployment. The following branches map to Cloud Foundry applications

git branch | CF organization | CF space | CF application | public URL | notes
---|---|---|---|---|---
dev | open-opportunities | dev | openopps | https://openopps-test.18f.gov | A public testing service for the latest development code
staging | open-opportunities | staging | openopps | https://openopps-staging.18f.gov | A staging server for reviewing releases
master | open-opportunities | master | openopps | https://openopps.digitalgov.gov | The production instance of Open Opportunities (for federal employee use only)


## Deployment Process

All changes to the application should follow the [GitHub flow process](https://github.com/18F/midas/blob/dev/CONTRIBUTING.md) outlined in the CONTRIBUTING.md document, which consists of making branches for changes and submitting them as pull requests against the `dev` branch.

PRs that are merged into `dev` will go through [Travis](https://travis-ci.org/18F/midas/builds/) for continuous integration testing and deployment.

### Staging

New releases destained for production should be tagged following semver and pushed submitted as a pull request against the `staging` branch.

PRs that are merged into `staging` will go through [Travis](https://travis-ci.org/18F/midas/builds/) for continuous integration testing and deployment.

### Deploy to production

Once a release has been validated on staging, open a new PR for the release against `master`.

PRs that are merged into `master` will go through [Travis](https://travis-ci.org/18F/midas/builds/) for continuous integration testing and deployment.

### Deploying to Cloud Foundry with a migration

If you have a migration that needs to be run, you'll need a few things:

1. `cf-ssh` installed on your machine. [Read the documentation here](https://docs.cloud.gov/getting-started/cf-ssh/)
2. "Access a postgres database using `cf-ssh`" which can be found on the
[cloud.gov documentation](https://docs.cloud.gov/apps/databases/)
3. Patience. Cloud Foundary will create new instances of the application within
the specific `space` and these builds and connections may take a while to complete.

Using `cf-ssh`, access the production instance of Open Opportunities. Make sure
you're on the proper branch on your local environment. This is because `cf-ssh`
uses the local files to build the new instance. Please note that this might take
a few minutes. Once you're into the production box follow the instructions on
the cloud.gov documentation for installing `psql`. We need `psql` because many
of the migration scripts we have in `/tools/postgres/migrate` are bash scripts
that run queries through `psql`.

Now you can simply run `./tools/postgres/migrate/yourscript.sh` and the migration
should be in place.

If you have a data migration script (generally the `.js` scripts in `/tools/postgres`,
you can run those from here too with `node /path/to/migration-script`. If your script
doesnt disable HTTP, you need to set the port to something like `PORT=9999 node path/to/mirgration-script`,
otherwise it may conflict with the port already running.

## Cloud Foundry configuration

Cloud Foundry applications read their settings from `env vars` set in manifest.yml files and user-provided services. Each CF space has a unique `env-openopps` user-provided service for storing sensitive `env vars`. If you have access to deploy to CF, you should have access to this service too.

To change values stored in the `env-openopps` service, see the [Cloud Foundry docs](https://docs.18f.gov).
