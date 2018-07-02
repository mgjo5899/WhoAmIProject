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
- Spotify
- Instagram
- Facebook
- GitHub
- Quora
- Stackoverflow
- more to come... 

## Instruction
1. Install [Docker](https://docs.docker.com/install/)
2. Set up MySQL server
    - Install MySQL Community Server from [the website](https://dev.mysql.com/downloads/mysql/)
        - Remember the password you set up when installing it; you'll be using that to get on to MySQL shell
    - Export `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_HOST`
        - Currently, `MYSQL_HOST` should be set as `127.0.0.1` in your local host machine
    - Make sure your MySQL server is running
    - Make aliases to MySQL commands
        - MySQL is installed in different directories for different OS
    - You don't have to set up admin user for your local host machine since you will be using Docker for development as well
        - If you are going to use Docker MySQL, stop your MySQL service and check if it has stopped completely
    - If you still want, you could add yourself as an admin user to MySQL server
        - `mysql -u root -p` and type the password you've set up during installation
        - `CREATE USER 'your_user_name'@'localhost' IDENTIFIED BY 'your_user_password';`
        - `GRANT ALL PRIVILEGES ON *.* TO 'your_user_name'@'localhost';`
3. Set up a Python 3 virtual environment
    - Create virtual environment at the designated directory
        - `python3 -m venv <directory_to_the_new_virtual_env>`
    - Start using the virtual environment
        - `source <directory_to_the_new_virtual_env>/bin/activate`
    - Upgrade PIP
        - `pip install --upgrade pip`
    - Install required Python packages
        - `pip install -r requirements.txt`
    - Set up `PYTHONPATH` in `activate` file
        - Add a line `export PYTHONPATH="<directory_to_backend_folder>" at the end of `activate` file
        - This is a temporary solution for resolving Backend module imports; will need to exchange it with `setup.py` later
4. Set up NPM
    - To be done...

## Note
- If you cannot access the local MySQL server with the SQL browser, try the following [solution](https://stackoverflow.com/questions/49194719/authentication-plugin-caching-sha2-password-cannot-be-loaded)
