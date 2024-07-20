#!/usr/bin/bash

# Get the branch name from the argument
BRANCH_NAME="$1"

# Find all container IDs with the specified branch label
CONTAINERS=$(docker ps -q --filter "label=branch=$BRANCH_NAME")

# Loop through each container and stop and remove it
while [ ! -z "$CONTAINERS" ]; do
    for CONTAINER_ID in $CONTAINERS; do
        echo "Stopping container $CONTAINER_ID..."
        docker stop $CONTAINER_ID
        echo "Removing container $CONTAINER_ID..."
        docker rm $CONTAINER_ID
    done
    # Recheck for any remaining containers
    CONTAINERS=$(docker ps -q --filter "label=branch=$BRANCH_NAME")
done

# Remove images with the specified label
IMAGES=$(docker images -q --filter "label=branch=$BRANCH_NAME")

while [ ! -z "$IMAGES" ]; do
    for IMAGE_ID in $IMAGES; do
        echo "Removing image $IMAGE_ID..."
        docker rmi $IMAGE_ID
    done
    # Recheck for any remaining images
    IMAGES=$(docker images -q --filter "label=branch=$BRANCH_NAME")
done

# Remove the port file if it exists
if [ -f "port.txt" ]; then
    rm port.txt
fi

echo "Cleanup completed for branch: $BRANCH_NAME"
