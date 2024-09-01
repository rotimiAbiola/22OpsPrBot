#!/usr/bin/env bash

# Update package list and install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt install docker-ce docker-ce-cli containerd.io -y

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker installation
docker --version

# Install Node.js and npm
sudo apt install nodejs npm -y

# Verify npm installation
npm --version

# Install PM2 globally using npm
sudo npm install -g pm2 -y

# Verify PM2 installation
pm2 --version

# Install Python3
sudo apt install python3 python3-pip -y

# Verify Python3 installation
python3 --version
pip3 --version
