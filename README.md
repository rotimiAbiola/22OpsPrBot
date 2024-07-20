# 22OpsPrBot Documentation

## Introduction
22OpsPrBot is an automated GitHub bot built with [Probot](https://github.com/probot/probot). It was designed to manage and streamline the pull request (PR) deployment process using Docker. The bot deploys PRs into isolated Docker containers for testing and review purposes, provides real-time deployment status updates, and cleans up resources upon PR closure.

## Features
- **Automated Deployment**: Deploys each PR in an isolated Docker container.
- **Multitasking**: handles pull request on multipe branches at the same time.
- **Real-time Updates**: Comments on PRs with deployment status and links.
- **Resource Management**: Cleans up Docker containers upon PR closure.

## Prerequisites
- A linux/ubuntu server
- A GitHub repository with appropriate permissions.

## Setup and Installation

### Setting up Environment
This requires installation of all dependencies and a setup of all environment variables needed. To simplify the process and ensure compatible versions of dependencies are used, a script environment_setup.sh has been added. 

   ```sh
   # To make the file executable
     chmod +x environment_setup.sh
   # Run the environment_setup.sh
     bash environment_setup.sh
   ```

### Clone the Repository
   ```sh
   # Clone the Github repository
     git clone https://github.com/rotimiAbiola/22OpsPrBot.git
   # Change directory into the project directory
     cd 22OpsPrBot
   ```
### Bot Setup
```sh
  npm start
```
  We need to stop npm using CTRL + C
  
- Access the .env file and copy out the webhook url
- Setup the github app:
   -  Navigate to [GitHub Developer Settings](https://github.com/settings/apps)
   -  On the GitHub Apps tab, click the **New GitHub App** button
   -  Fill in the Details:
         - **GitHub App name:** Provide a name for your app.
         - **Homepage URL:** Provide a URL for the homepage of your app (you can use webhook URL).
         - **Webhook URL:** Provide a URL to receive webhook payloads.
         - **Webhook secret:** A secret key to secure webhook payloads (generate a mix of alphanumeric secret).
         - **Permissions:** Configure the permissions your app needs:
               - **Repository**:
                    - **Content:** Read and write
                    - **Issues:** Read and write
                    - **Pull Requests:** Read and write
                    - **Webhook:** Read and write
               - **Organization:**
                    - **Member:** Read Only
         - **Subscribe to events:**
               - **Pull request**
               - **Pull request review**
               - **Pull request review thread**
               - **Pull request review comment**
   -  Under **Where can this GitHub App be installed?**, choose either "Only on this account" OR "Any account"
   -  Click **Create GitHub App** to make changes.
   -  Generate a Private Key to authenticate with Github (the Private Key is automatically downloaded as a file).
   -  **Install the GitHub App:** On the Github page, click **Install App** and then choose the desired repository.
     
### Configure the Bot to use the Github App       
```sh
 npm start
 ```
- Open your web browser
- If you are running your bot on a remote server, input *ip:port* press ENTER OR *localhost:port* if running bot on local machine. 
- Select **Use an existing Github App**
- Fill the form with the necessary details.
- Check to confirm the installation of the github apps on your repository.
      - Under Repository Settings > Github Apps
      - Check to see if the App you installed is on the list.
 **Configure the Repository webhook settings**
      Under Repository Settings: 
      - Pass in the URL
      - Pass in the secret (must be the same secret used while installing the App) 
      - Select the json file format
      - Select all "pull requests" options
      - Add the webhook

### Setting Up Bot to Run at the Background
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
- **PR Closure**: Upon PR closure, the bot cleans up the associated Docker container to free up resources.

## Contributing
Contributions are welcome Please fork the repository and create a new branch for your feature or bug fix. Ensure that your code adheres to the existing style guidelines and includes appropriate tests.


For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2024 22Ops Team - HNG11
