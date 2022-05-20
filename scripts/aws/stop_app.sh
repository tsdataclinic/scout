#!/bin/bash

# The `|| :` suppresses the exit code of 1 in case there are no
# services running and forces pm2 to return an exit code 0
pm2 stop all || :
pm2 delete all || :
