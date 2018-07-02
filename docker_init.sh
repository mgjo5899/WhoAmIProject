#!/bin/bash
#
DOCKER_PROCESS=$(docker ps | head -1)

if [ ${DOCKER_PROCESS:0:9} == "CONTAINER" ]
then
    echo "Docker is up!"

    echo "docker stop all"
    docker stop $(docker ps -q -a)

    echo "docker rm all"
    docker rm $(docker ps -q -a)

    echo "docker rmi all"
    docker rmi $(docker images -q)

    echo "docker build backend"
    docker build -t backend .
fi

###############################
