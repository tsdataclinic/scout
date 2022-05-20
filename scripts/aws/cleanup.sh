#!/bin/bash
# Cleanup things from the previous deployment

if [ -d /srv/scout ]; then
  rm -rf /srv/scout
fi

mkdir /srv/scout
