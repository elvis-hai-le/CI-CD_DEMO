#!/bin/bash
echo $PATH
export PATH=$PATH:/usr/local/bin
cd /home/ubuntu/CI-CD_DEMO/
git pull origin main
set -x
npm ci --verbose &&
npm run build &&
pm2 restart Snake_app