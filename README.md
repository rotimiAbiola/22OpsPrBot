# 22OpsPrBot Documentation

## Introduction
22OpsPrBot is an automated GitHub bot built with [Probot](https://github.com/probot/probot). It was designed to manage and streamline the pull request (PR) deployment process using Docker. The bot deploys PRs into isolated Docker containers for testing and review purposes, provides real-time deployment status updates, and cleans up resources upon PR closure.

## Features
- **Automated Deployment**: Deploys each PR in an isolated Docker container.
- **Multitasking**: handles pull request on multipe branches at the same time
- **Real-time Updates**: Comments on PRs with deployment status and links.
- **Resource Management**: Cleans up Docker containers upon PR closure.

## Prerequisites
- A linux/ubuntu server
- A GitHub repository with appropriate permissions.

## Setup and Installation

**Clone the Repository**
   ```sh
   # Change directory into the project directory
     cd 22OpsPrBot
   # Clone the Github repository
     git clone https://github.com/rotimiAbiola/22OpsPrBot.git
   ```
### Setting up Environment
This requires installation of all dependencies and a setup of all environment variables needed. To simplify the process and ensure compatible versions of dependencies are used, a script environment_setup.sh has been added. 

   ```sh
   # To make the file executable
     chmod +x environment_setup.sh
   # Run the environment_setup.sh
     bash environment_setup.sh
   ```

### Bot Setup
```sh
 npm start
```
- Access the .env file and copy out the webhook url
- Setup the github app:
   -  Navigate to [GitHub Developer Settings](https://github.com/settings/apps)
   -  On the GitHub Apps tab, click the **New GitHub App** button
   -  Fill in the Details:
         - **GitHub App name:** Provide a name for your app.
         - **Homepage URL:** Provide a URL for the homepage of your app.
         - **User authorization callback URL:** This is the URL where users will be redirected after they authorize your app.
         - **Webhook URL:** Provide a URL to receive webhook payloads.
         - **Webhook secret:** (optional) A secret key to secure webhook payloads.
         - **Permissions:** Configure the permissions your app needs:
               - **Repository**: Read & Write
               - **Actions**: Read & Write
         - **Subscribe to events:** Choose the events your app will listen to.
   -  Click **Create GitHub App** to make changes.
   -  Generate and download a Private Key to authenticate with Github.
      **Note:** Securely store the private key file as it will not be shown again.
   -  Install the GitHub App: On the Github page, click **Install App** and then choose the desired repository.
   -  Configure Your Application to Use the GitHub App: Set up environment variables in your application (see the **Secrets** section below).

         
```sh
 npm start
 ```
- Go to the ip:port for sever or localhost. 
- Select repository that you have already created the github app on
- Fill the form with the necessary details
- Check to confirm the installation of the github apps on your repository.
- Configure the webhook settings:
      - Pass in the URL
      - Pass in the secret
      - Select the json file format
      - Select all "pull requests" options
      - Add the webhook


**Configure Docker**
Ensure Docker is installed and running on your server. Follow the official Docker installation guide if needed.
         ```sh
         # 1. Build container
         docker build -t pr-bot .
         
         # 2. Start container
         docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> pr-bot
         ```

## Environment Variables
Set the following environment variables in your GitHub repository settings under **Secrets**:
- `GITHUB_APP_ID`: The App ID of your GitHub App.
- `GITHUB_PRIVATE_KEY`: The private key generated for your GitHub App.
- `WEBHOOK_SECRET`: The webhook secret you configured.
- `DOCKER_USERNAME`: Your Docker Hub username.
- `DOCKER_PASSWORD`: Your Docker Hub password.


## Usage

### Pull Request Deployment
- **Create a Pull Request**: When a new PR is created, the bot triggers a GitHub Actions workflow to build and deploy the PR in a Docker container.
- **Real-time Status Updates**: The bot comments on the PR with the deployment status and a link to the deployed environment.
- **Subsequent Commits**: Any new commits to the PR branch update the existing Docker container with the latest changes.
- **PR Closure**: Upon PR closure, the bot cleans up the associated Docker container to free up resources.

- **PR Deployment Workflow**: Triggers on PR creation and updates. Builds and deploys the PR in a Docker container.
- **PR Cleanup Workflow**: Triggers on PR closure. Cleans up Docker containers associated with the closed PR.

### Bot Commands
The bot supports the following commands within PR comments:
- `@22OpsPrBot deploy`: Manually trigger the deployment process.
- `@22OpsPrBot status`: Check the current deployment status of the PR.
- `@22OpsPrBot cleanup`: Manually trigger the cleanup process for the PR.

## Development and Testing

### Local Testing
To test the bot locally, follow these steps:

1. **Install Dependencies**:
      ```bash
      pip install -r requirements.txt
      ```
2. **Run the Bot Locally:**
     ```bash
     python bot.py
     ```
3. **Docker Build and Run:**
      ```bash
      docker build -t 22opsprbot .
      docker run -d -p 8000:8000 22opsprbot
      ```
## Contributing
Contributions are welcome Please fork the repository and create a new branch for your feature or bug fix. Ensure that your code adheres to the existing style guidelines and includes appropriate tests.


For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2024 22Ops Team - HNG11
