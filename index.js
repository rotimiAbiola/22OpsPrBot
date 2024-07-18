const express = require('express');
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');
const { Webhooks, createNodeMiddleware } = require('@octokit/webhooks');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Load environment variables from the .env file
const { APP_ID, PRIVATE_KEY_PATH, WEBHOOK_SECRET, PORT } = process.env;

// Read the private key for GitHub App authentication
const privateKey = fs.readFileSync(path.join(__dirname, PRIVATE_KEY_PATH), 'utf8');

// Initialize Octokit, which is GitHub's official SDK for interacting with the GitHub API
const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: APP_ID,
    privateKey: privateKey,
  },
});

// Initialize GitHub Webhooks handler
const webhooks = new Webhooks({
  secret: WEBHOOK_SECRET,
});

// Event handler for when a pull request is opened
webhooks.on('pull_request.opened', async ({ id, name, payload }) => {
  const { repository, pull_request } = payload;

  // Post a status update to the PR's commit to indicate the CI/CD pipeline is running
  await octokit.repos.createCommitStatus({
    owner: repository.owner.login,
    repo: repository.name,
    sha: pull_request.head.sha,
    state: 'pending',
    context: 'CI/CD',
    description: 'CI/CD pipeline is running',
    target_url: 'http://ci.example.com/build/status' // URL to the CI/CD status page
  });

  // Post a comment on the PR with a deployment link (simulated)
  await octokit.issues.createComment({
    owner: repository.owner.login,
    repo: repository.name,
    issue_number: pull_request.number,
    body: `Deployment in progress: [View Deployment](http://ci.example.com/deployments/${pull_request.number})`
  });
});

// Event handler for when a pull request is closed (either merged or not merged)
webhooks.on('pull_request.closed', async ({ id, name, payload }) => {
  const { repository, pull_request } = payload;

  if (pull_request.merged) {
    // If the PR was merged, post a success status update
    await octokit.repos.createCommitStatus({
      owner: repository.owner.login,
      repo: repository.name,
      sha: pull_request.head.sha,
      state: 'success',
      context: 'CI/CD',
      description: 'PR merged and deployed successfully',
      target_url: 'http://ci.example.com/build/status' // URL to the CI/CD status page
    });

    // Post a comment on the PR with the deployment success message
    await octokit.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: pull_request.number,
      body: `Deployment successful: [View Deployment](http://ci.example.com/deployments/${pull_request.number})`
    });
  } else {
    // If the PR was not merged, clean up resources related to this PR
    exec(`./cleanup.sh ${pull_request.number}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during cleanup: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Cleanup stderr: ${stderr}`);
        return;
      }
      console.log(`Cleanup stdout: ${stdout}`);
    });

    // Post a comment on the PR indicating the resources have been cleaned up
    await octokit.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: pull_request.number,
      body: 'Resources cleaned up after PR closure.'
    });
  }
});

// Create an Express app
const app = express();

// Use the GitHub Webhooks middleware to handle incoming webhook events
app.use(createNodeMiddleware(webhooks));

// Start the Express server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
