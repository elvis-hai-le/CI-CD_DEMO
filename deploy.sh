#!/bin/bash
cd /home/ubuntu/CI-CD_DEMO/
git pull origin main
npm ci &&
npm run build &&
pkill screen
screen -d -m npm run start 