const { Probot } = require('probot');

module.exports = (app) => {
  // Event handler for when a pull request is opened
  app.on('pull_request.opened', async (context) => {
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

    // Post a deployment link comment
    const comment = context.issue({
      body: `Deployment in progress: [View Deployment](http://ci.example.com/deployments/${pull_request.number})`
    });
    await context.octokit.issues.createComment(comment);
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

      // Post a deployment success message
      const comment = context.issue({
        body: `Deployment successful: [View Deployment](http://ci.example.com/deployments/${pull_request.number})`
      });
      await context.octokit.issues.createComment(comment);
    } else {
      // Clean up resources
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

      // Post a cleanup message
      const comment = context.issue({
        body: 'Resources cleaned up after PR closure.'
      });
      await context.octokit.issues.createComment(comment);
    }
  });
};
