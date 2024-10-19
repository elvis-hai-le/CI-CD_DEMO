#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd /home/ubuntu/CI-CD_DEMO/
git pull origin main
npm npm ci --prefer-offline --no-audit &&
npm run build &&
pm2 restart snake