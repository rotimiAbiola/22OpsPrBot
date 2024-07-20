#!/usr/bin/bash

# Get the branch name from the argument
BRANCH_NAME="$1"

# Find and stop the Docker container running the specified branch
CONTAINER_ID=$(docker ps -q --filter ancestor=$BRANCH_NAME)
if [ ! -z "$CONTAINER_ID" ]; then
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
fi

# Remove the Docker image
docker rmi $BRANCH_NAME

# Remove the port file if it exists
if [ -f "port.txt" ]; then
    rm port.txt
fi

echo "Cleanup completed for branch: $BRANCH_NAME"
