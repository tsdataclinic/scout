#!/bin/bash
# Cleanup things from the previous deployment
pm2 stop all --silent
pm2 delete all --silent
