import { Probot } from "probot";
import { exec } from "child_process";
import util from 'util';
import fs from 'fs/promises';


const execPromise = util.promisify(exec);

export default (app) => {
  // Event handler for when a pull request is opened
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'], async (context) => {
    const { repository, pull_request } = context.payload;

    // Post a status update
    const status = context.repo({
      sha: pull_request.head.sha,
      state: 'pending',
      context: 'CI/CD',
      description: 'CI/CD pipeline is running',
      target_url: 'http://ci.example.com/build/status'
    });
    await context.octokit.repos.createCommitStatus(status);


    if (pull_request.synchronize) {

        // Initial comment
        const comment = context.issue({
            body: 'Deployment is restarting... '
        });
        await context.octokit.issues.createComment(comment);
    }  else { 
        // Initial comment
        const comment = context.issue({
            body: 'Deployment is starting... '
        });
        await context.octokit.issues.createComment(comment);
    }

    try {
      // Run the deployment script
      const branchName = context.payload.pull_request.head.ref;
      const sudo_password = process.env.SUDO_PASSWORD;
      const { stdout, stderr } = await execPromise(`echo ${sudo_password} | sudo -S ./deploy.sh ${branchName}`);
      console.log('Deployment output:', stdout);
      const port = await fs.readFile('port.txt', 'utf8');
      const deploymentUrl = `http://91.229.239.118:${port.trim()}`;


      if (stderr) {
        console.error('Deployment errors:', stderr);
      }

      // Update comment with success
      const comment = context.issue({
        body: `Deployment completed successfully! Access your application at ${deploymentUrl}`
      });
      await context.octokit.issues.createComment(comment);


      // Clean up the temporary file
      await fs.unlink('port.txt');

    } catch (error) {
      // Update comment with failure
      const comment = context.issue({
        body: `Deployment failed: ${error.message}`
      });
      await context.octokit.issues.createComment(comment);

    }
  });

  // Event handler for when a pull request is closed
  app.on('pull_request.closed', async (context) => {
    const { repository, pull_request } = context.payload;

    if (pull_request.merged) {
      // Post a success status update
      const status = context.repo({
        sha: pull_request.head.sha,
        state: 'success',
        context: 'CI/CD',
        description: 'PR merged and deployed successfully',
        target_url: 'http://ci.example.com/build/status'
      });
      await context.octokit.repos.createCommitStatus(status);

      // Post a PR Merged success message
      const comment = context.issue({
        body: 'Congrats, The Pull Request has been merged!'
      });
      await context.octokit.issues.createComment(comment);
    }

    // Initial comment
    const comment = context.issue({
        body: 'Cleanup is starting... '
      });
      await context.octokit.issues.createComment(comment);

    try {
        // Clean up resources
        const branchName = context.payload.pull_request.head.ref;
        const sudo_password = process.env.SUDO_PASSWORD;
        const { stdout, stderr } = await execPromise(`echo ${sudo_password} | sudo -S ./cleanup.sh ${branchName}`);
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
          body: `Cleanup failed: ${error.message}`
        });
        await context.octokit.issues.createComment(comment);
  
    }
  });
};
