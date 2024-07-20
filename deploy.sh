#!/usr/bin/bash

set -e

GITHUB_REPO_URL=https://github.com/rotimiAbiola/flask-example.git
GITHUB_BRANCH="$1"
PR_NUMBER="$2"
TIMESTAMP=$(date "+%Y%m%d%H%M%S")
FREE_PORT=$(python3 -c 'import socket; s = socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()')
IMAGE_NAME="${GITHUB_BRANCH}${PR_NUMBER}${TIMESTAMP}"

git clone -b $GITHUB_BRANCH $GITHUB_REPO_URL temp/
cd temp

docker build --label branch=$GITHUB_BRANCH -t $IMAGE_NAME .
docker run -d --label branch=$GITHUB_BRANCH -p $FREE_PORT:5000 $IMAGE_NAME
# docker rmi $IMAGE_NAME

cd ..
rm -rf temp

echo $FREE_PORT > port.txt
echo 'The Application has been successfully deployed'
