#!/usr/bin/env bash

# Update package list and install dependencies
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt install docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker installation
sudo docker --version

# Install Node.js and npm
sudo apt install nodejs npm

# Verify npm installation
npm --version

# Install Git
sudo apt install git

# Verify Git installation
git --version

# Install PM2 globally using npm
sudo npm install -g pm2

# Verify PM2 installation
pm2 --version

# Install Python3
sudo apt install python3 python3-pip

# Verify Python3 installation
python3 --version
pip3 --version
