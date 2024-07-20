#!/usr/bin/bash

GITHUB_REPO_URL=https://github.com/rotimiAbiola/flask-example.git
GITHUB_BRANCH="$1"
FREE_PORT=$(python3 -c 'import socket; s = socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()')

git clone -b $GITHUB_BRANCH $GITHUB_REPO_URL temp/
cd temp

docker build -t $GITHUB_BRANCH .
docker run -d -p $FREE_PORT:5000 $GITHUB_BRANCH

cd ..
rm -rf temp

echo $FREE_PORT > port.txt
echo 'The Application has been successfully deployed'
