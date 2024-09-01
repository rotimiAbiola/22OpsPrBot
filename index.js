import { Probot } from "probot";
import { exec } from "child_process";
import util from 'util';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();
const execPromise = util.promisify(exec);

async function checkApprovalStatus(context, pull_request, action) {
  const { repository } = context.payload;
  
  if (action === 'reopened') {
    const status = context.repo({
      sha: pull_request.head.sha,
      state: 'pending',
      context: 'Approval Review',
      description: 'Waiting for new approval after reopening'
    });
    return await context.octokit.repos.createCommitStatus(status);
  }

  const reviews = await context.octokit.pulls.listReviews({
    owner: repository.owner.login,
    repo: repository.name,
    pull_number: pull_request.number,
  });

  let hasApproval = false;
  if (action === 'synchronize') {
    const lastPushDate = new Date(pull_request.head.repo.pushed_at);
    hasApproval = reviews.data.some(review => 
      review.state === 'APPROVED' && new Date(review.submitted_at) > lastPushDate
    );
  } else {
    hasApproval = reviews.data.some(review => review.state === 'APPROVED');
  }

  const status = context.repo({
    sha: pull_request.head.sha,
    state: hasApproval ? 'success' : 'pending',
    context: 'Approval Review',
    description: hasApproval ? 'Approved by a reviewer' : 'Waiting for approval'
  });

  await context.octokit.repos.createCommitStatus(status);
}

export default (app) => {
  // Event handler for when a pull request is opened
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'], async (context) => {
    const { repository, pull_request, action } = context.payload;

    // Post a status update
    const status = context.repo({
      sha: pull_request.head.sha,
      state: 'pending',
      context: 'DEPLOY',
      description: 'Automated PR deployment bot is running' 
    });
    await context.octokit.repos.createCommitStatus(status);

    // Check approval status
    await checkApprovalStatus(context, pull_request, action);

    try {
      // Run the deployment script
      const branchName = context.payload.pull_request.head.ref;
      const pullRequestNumber = pull_request.number;
      const forkedRepoUrl = context.payload.pull_request.head.repo.clone_url;
      const { stdout, stderr } = await execPromise(`chmod +x ./deploy.sh && sudo ./deploy.sh ${branchName} ${pullRequestNumber} ${forkedRepoUrl}`);
      console.log('Deployment output:', stdout);
      const port = await fs.readFile('port.txt', 'utf8');
      const deploymentIp = process.env.DEPLOYMENT_IP;
      const deploymentUrl = `http://${deploymentIp}:${port.trim()}`;
      
      if (stderr) {
        console.error('Deployment errors:', stderr);
      }
      
      const currentDate = new Date().toUTCString();
      const markdownComment = `
Deployment Successful

| Branch | Status | Preview |Updated (UTC) |
|--------|--------|---------|--------------|
| ${context.payload.pull_request.head.ref} | ✅ Success ([Inspect](${deploymentUrl})) | [Visit Preview](${deploymentUrl}) | ${currentDate} |

`; 
      // Update comment with success
      const comment = context.issue({
        body: markdownComment
      });
      await context.octokit.issues.createComment(comment);

      // Post a success status update
      const status = context.repo({
        sha: pull_request.head.sha,
        state: 'success',
        context: 'DEPLOY',
        description: 'PR deployed successfully',
        target_url: `${deploymentUrl}`
      });
      await context.octokit.repos.createCommitStatus(status);

      // Clean up the temporary file
      await fs.unlink('port.txt');

    } catch (error) {
      // Update comment with failure
      console.error('Deployment errors:', error);
      const currentDate = new Date().toUTCString();
      const markdownComment = `
Deployment Failed

| Branch | Status | Preview |Updated (UTC) |
|--------|--------|---------|--------------|
| ${context.payload.pull_request.head.ref} | ❌ Failed | ${currentDate} |

`;
      const comment = context.issue({
        body: markdownComment
      });
      await context.octokit.issues.createComment(comment);

      // Post a failure status update
      const status = context.repo({
        sha: pull_request.head.sha,
        state: 'failure',
        context: 'DEPLOY',
        description: 'PR deployment failed' 
      });
      await context.octokit.repos.createCommitStatus(status);
    }
  });

  app.on('pull_request_review.submitted', async (context) => {
    const { pull_request } = context.payload;
    await checkApprovalStatus(context, pull_request, 'review_submitted');
  });

  // Event handler for when a pull request is closed
  app.on('pull_request.closed', async (context) => {
    const { repository, pull_request } = context.payload;

    if (pull_request.merged) {
      // Post a success status update
      const status = context.repo({
        sha: pull_request.head.sha,
        state: 'success',
        context: 'MERGE',
        description: 'PR merged successfully'

      });
      await context.octokit.repos.createCommitStatus(status);

      // Post a PR Merged success message
      const comment = context.issue({
        body: 'The Pull Request has been merged!'
      });
      await context.octokit.issues.createComment(comment);
    }


    try {
        // Clean up resources
        const branchName = context.payload.pull_request.head.ref;
        const { stdout, stderr } = await execPromise(`chmod +x ./cleanup.sh && sudo ./cleanup.sh ${branchName}`);
        console.log('Cleanup output:', stdout);

        if (stderr) {
            console.error(`Cleanup errors: ${stderr}`);
        }

        // Post a cleanup message
        const comment = context.issue({
            body: 'Resources cleaned up after PR closure.'
        });
        await context.octokit.issues.createComment(comment);
    } catch (error) {
        // Update comment with failure
        const comment = context.issue({
          body: 'Cleanup failed.'
        });
        await context.octokit.issues.createComment(comment);
    }
  });
};
