Scripts in this directory are intended to be run as part of the CI/CD GitHub Action workflow with AWS CodeDeploy.

These scripts are not intended to be run manually. They only make sense in the context of the AWS instance where this product runs.

The order in which scripts are run during deployment are:

1. `stop.sh`
2. `cleanup.sh`
3. `prepare.sh`
4. `start.sh`
