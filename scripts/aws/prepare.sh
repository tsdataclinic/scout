cd /home/ec2-user/app
cd packages/server

# TODO: missing: update env files

# Run the db migration
# TODO: use an actual migration script, which is what TypeORM recommends,
# instead of using the sync command
yarn sync-schema
