#!/bin/bash
export PATH=$PATH:/usr/local/bin
cd /home/ubuntu/CI-CD_DEMO/
git pull origin main
npm clean-install &&
npm run build &&
pm2 restart Snake_app