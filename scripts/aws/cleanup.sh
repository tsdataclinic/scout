#!/bin/bash
# Cleanup things from the previous deployment
source ~/.bash_profile
echo $HOME
echo $PATH
which npm
which pm2
/usr/bin/pm2 stop all
/usr/bin/pm2 delete all
