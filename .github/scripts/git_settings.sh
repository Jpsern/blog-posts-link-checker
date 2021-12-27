#!/bin/bash

set -e

if [ -z "$USER_NAME" ] && [ -z "$USER_EMAIL" ]; then
    # github-actions bot としてコミットするための設定
    # https://github.com/actions/checkout/discussions/479
    USER_NAME="github-actions[bot]" 
    USER_EMAIL="github-actions[bot]@users.noreply.github.com" 
elif [ -z "$USER_EMAIL" ] || [ -z "$USER_NAME" ]; then
    echo 'Not enough settings'
    exit 1
fi

git config --local user.email $USER_EMAIL
git config --local user.name $USER_NAME
git fetch origin
git checkout $(echo ${GITHUB_REF#refs/heads/})
git pull
