#!/bin/bash

# Get the pull request number from the script arguments
PR_NUMBER=$1

echo "Cleaning up resources for PR #${PR_NUMBER}"

# Example cleanup commands: 
# Shut down and remove Docker containers defined in a compose file specific to the PR
docker-compose -f docker-compose.pr${PR_NUMBER}.yml down
# Remove unused Docker resources
docker system prune -f

echo "Cleanup completed for PR #${PR_NUMBER}"
