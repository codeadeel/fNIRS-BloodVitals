#!/usr/bin/env bash

# Making resources directory
echo ">> Making Resources Directory"
mkdir ./resources

# Copying the resource files to target directory
echo ">> Gathering Resources"
mv ./frontend/dist ./resources/
mv ./frontend/nginxCaptive.conf ./resources/default
mv ./networkManager ./resources/
mv ./updateDaemon ./resources/
mv ./adcDaemon ./resources/
mv ./OLED ./resources/
mv ./requirements.txt ./resources/

# Making Tarball
echo ">> Making Tarball"
tar -cvf ./package.tar ./resources
