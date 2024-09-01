# 22OpsPrBot Documentation

## Introduction
22OpsPrBot is an automated GitHub bot built with [Probot](https://github.com/probot/probot). It was designed to manage and streamline the pull request (PR) deployment process using Docker. The bot deploys PRs into isolated Docker containers for testing and review purposes, provides real-time deployment status updates, and cleans up resources upon PR closure.

## Features
- **Automated Deployment**: Deploys each PR in an isolated Docker container.
- **Multitasking**: handles pull request on multipe branches at the same time.
- **Real-time Updates**: Comments on PRs with deployment status and links.
- **Real-time Status Check**: Implements status checks for PR deployment and approval review.
- **Resource Management**: Cleans up Docker containers upon PR closure.

## Prerequisites
- A linux/ubuntu server (To avoid any issues, ensure that your user has sudo privileges)
- A GitHub repository with appropriate permissions.

## Setup and Installation

### Setting up Environment
This requires the installation of all dependencies and a setup of all environment variables needed. To simplify the process and ensure compatible versions of dependencies are used, a script _environment_setup.sh_ has been added. 

### Clone the Repository
   - Ensure git is installed. Run:
   ```sh
   git --version
   ```
   If git is not installed, then install git using:
   ```sh
   sudo apt install git -y
   ```
   Then clone the GitHub repository:
   ```sh
   # Clone the Github repository
   git clone https://github.com/rotimiAbiola/22OpsPrBot.git
   # Change directory into the project directory
   cd 22OpsPrBot
   ```

### Run the Setup Script
   ```sh
   # To make the file executable
   sudo chmod +x environment_setup.sh
   # Run the environment_setup.sh
   bash environment_setup.sh
   ```

### Bot Setup
```sh
npm install
npm start
```
Stop npm using CTRL + C or its alternative
  
- Access the .env file and copy out the webhook url
- Setup the github app:
   -  Navigate to your [GitHub Developer Settings](https://github.com/settings/apps)
   -  On the GitHub Apps tab, click the **New GitHub App** button
   -  Fill in the Details:
         - **GitHub App name:** Provide a name for your app.
         - **Homepage URL:** Provide a URL for the homepage of your app (you can use webhook URL).
         - **Webhook URL:** Provide a URL to receive webhook payloads.
         - **Webhook secret:** A secret key to secure webhook payloads (generate a mix of alphanumeric secret).
         - **Permissions:** Configure the permissions your app needs:
         - **Repository Permissions Needed**:
              - **Content:** Read and write
              - **Issues:** Read and write
              - **Pull Requests:** Read and write
              - **Webhook:** Read and write
         - **Organization Permissions Needed:**
              - **Member:** Read Only
         - **Subscribe to Necessary events:**
               - **Pull request**
               - **Pull request review**
               - **Pull request review thread**
               - **Pull request review comment**
   -  Under _**Where can this GitHub App be installed?**_, choose either _"Only on this account"_ OR _"Any account"_
   -  Click _**Create GitHub App**_ to make changes.
   -  Generate a Private Key to authenticate with Github (the Private Key is automatically downloaded as a file).
   -  **Install the GitHub App:** On the Github page, click _**Install App**_ and then choose the desired repository.
     
### Configure the Bot to use the Github App       
```sh
npm start
```

1. Open your web browser
2. If you are running your bot on a remote server, input _*ip:port*_ press ENTER OR _*localhost:port*_ if running bot on local machine.
3. Select _**Use an existing Github App**_
4. Fill the form with the necessary details.
5. Check to confirm the installation of the github app on your repository.
      - Under Repository Settings > GitHub Apps
      - Check to see if the App you installed is on the list.

6. Configure the Repository webhook settings
      - Go to Repository Settings:
      - Pass in the Webhook URL:
      - Pass in the secret (must be the same secret used while installing the App) 
      - Select the JSON file format
      - Select all "pull requests" options
      - Add the webhook

### .env file content
your .env file must contain the following variables:
- WEBHOOK_PROXY_URL
- PORT
- APP_ID
- PRIVATE_KEY
- WEBHOOK_SECRET
- DEPLOYMENT_IP
  
### Setting Up Bot to Run at the Background Using PM2
```sh
pm2 start npm -- start
```
**Check if the Bot is Active**
```sh
pm2 status
```
**To Check Bot Logs**
```sh
pm2 log npm
```

## Usage

- **Create a Pull Request**: When a new PR is created or reopened, the bot is triggered and the pull request is deployed to a Docker container.
- **Real-time Status Updates**: The bot comments on the PR with the deployment status and a link to the deployed environment.
- **Subsequent Commits**: Any new commits to the open PR branch deploys a Docker container with the latest changes.
- **PR Closure**: Upon PR closure, the bot cleans up the associated Docker containers to free up resources.

## Contributing
Contributions are welcome Please fork the repository and create a new branch for your feature or bug fix. Ensure that your code adheres to the existing style guidelines and includes appropriate tests.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2024 22Ops Team - HNG11
