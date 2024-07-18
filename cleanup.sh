#!/bin/bash

PR_NUMBER=$1

echo "Cleaning up resources for PR #${PR_NUMBER}"

# Example cleanup commands
docker-compose -f docker-compose.pr${PR_NUMBER}.yml down
docker system prune -f

echo "Cleanup completed for PR #${PR_NUMBER}"
