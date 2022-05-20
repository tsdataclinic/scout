cd /home/ec2-user/app

# start the API server
cd packages/server
pm2 start "yarn start:prod" --name server

# start the frontend server
pm2 start "serve -s build" --name frontend
