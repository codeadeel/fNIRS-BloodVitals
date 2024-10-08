#!/usr/bin/env bash

DEPLOYMENT_DIRECTORY=./services/fnirswebapp

# Creating directory for deployment
mkdir -p $DEPLOYMENT_DIRECTORY

# Shutdown docker-compose if file already exist & remove existing Docker Image
if [ -e "$DEPLOYMENT_DIRECTORY/docker-compose.yml" ]; then
    docker compose --profile deployment down -f $DEPLOYMENT_DIRECTORY/docker-compose.yml
    docker rmi codeadeel/private:fnirswebapp
else 
    echo "docker-compose.yml not Found"
fi 

# Copying the deployment payload to the target directory
cp ./fNIRS-BloodVitals/docker-compose.yml $DEPLOYMENT_DIRECTORY/

# Moving the curernt workspace to target directory
cd $DEPLOYMENT_DIRECTORY

# Run docker-compose.yml
docker compose --profile deployment up -d
