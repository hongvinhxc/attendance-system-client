#!/bin/bash

# Build docker image
docker build -t attendance-client:latest .

# Compose container
docker-compose up -d attendance-client

echo "";