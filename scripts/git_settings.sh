#!/bin/bash

git config --local user.email $REPOSITORY_OWNER_EMAIL
git config --local user.name $REPOSITORY_OWNER
git checkout $(echo ${GITHUB_REF#refs/heads/})
