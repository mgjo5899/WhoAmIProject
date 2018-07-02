#!/bin/bash

DOCKER_PROCESS=$(docker ps | head -1)

if [ ${DOCKER_PROCESS:0:9} == "CONTAINER" ]
then
    echo "Docker is up!"

    echo "docker run -p 5000:5000 -it backend"
    docker run -p 5000:5000 -it backend 
fi

###############################
