#!/bin/bash -e

/wait-for-it.sh -t 30 database:3306

npm start
