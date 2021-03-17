#!/bin/bash

git config --local user.email ${{ secrets.REPOSITORY_OWNER_EMAIL }}
git config --local user.name ${{ github.repository_owner }}
# git checkout $(echo ${GITHUB_REF#refs/heads/}) 
