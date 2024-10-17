#!/bin/bash
# if [[ ! -d CI-CD_DEMO ]]
# then
#     echo "Cloning from CI-CD_DEMO Git repo"
#     git clone https://github.com/elvis-hai-le/CI-CD_DEMO.git
#     cd /home/ubuntu/CI-CD_DEMO/
# else
#     cd /home/ubuntu/CI-CD_DEMO/
#     git pull origin main
# fi
echo "Cloning from CI-CD_DEMO Git repo"
git clone https://github.com/elvis-hai-le/CI-CD_DEMO.git
cd /home/ubuntu/CI-CD_DEMO/
npm ci &&
npm run build &&
pkill screen
screen -d -m npm run start 