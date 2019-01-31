# Project Plan

## What are we creating
- To create a board (website) that represents a person by only using data from social media
- To replace many other social media buttons with just one button that directs people to see one's board, which has all the bits about the person

## Technologies
- Frontend: React JS
- Backend: Flask (Python 3)
- Database: MySQL
- ORM: SQLAlchemy

## Services in mind
- Medium
- Spotify
- Instagram
- Facebook
- GitHub
- Quora
- Brunch
- Stackoverflow
- more to come... 

## Instruction
1. Install [Docker](https://docs.docker.com/install/)
  - We will be using MySQL on a Docker container
2. Install [Python 3](https://www.python.org/) and set up [Pipenv](https://pipenv.readthedocs.io/en/latest/), Python virtual environment
  - After installing Python 3, install Pipenv
    - `python3 -m pip install pipenv`
  - Go into the backend directory and set up the local Pipenv
    - `pipenv shell`
    - `ctrl + D` to get out of the Pipenv shell
  - Install required Python packages
    - `pipenv install --dev -e .`
4. Install [Node and NPM](https://www.npmjs.com/)
  - After installing Node and NPM, install packages
    - `npm install .`
