#!/bin/bash
# Cleanup things from the previous deployment
pm2 stop all
pm2 delete all
