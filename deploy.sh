#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Set variables
reponame=CI-CD_DEMO
repodir=/home/ubuntu/${reponame}
webdir=/home/ubuntu/dist
codedeployname=Snake
environment=production
s3bucket=cicd-codeploy-bucket

cd /home/ubuntu/CI-CD_DEMO/
git pull origin main

#check for build folder and delete if exists
[ -d $webdir ] && rm -frv ${webdir}/*
aws s3 sync s3://${s3bucket}/${codedeployname}/${environment}/ ${webdir}/ --delete

bun install --frozen-lockfile --production &&
pm2 restart snake