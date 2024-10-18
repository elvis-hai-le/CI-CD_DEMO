#!/bin/bash
cd /home/ubuntu/CI-CD_DEMO/
git pull origin main
npm install &&
npm run build &&
pm2 restart Snake_app