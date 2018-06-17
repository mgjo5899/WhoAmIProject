# Backend

## Technologies
|               |            |
| :--           | :--        |
| **Language**  | Python 3   |
| **Framework** | Flask      |
| **Database**  | MySQL      |
| **ORM**       | SQLAlchemy |

## Installation
1. Set up MySQL server
    - Install MySQL Community Server from [the website](https://dev.mysql.com/downloads/mysql/)
        - Remember the password you set up when installing it; you'll be using that to get on to MySQL shell
    - Make sure your MySQL server is running
    - Make aliases to MySQL commands
        - MySQL is installed in different directories for different operating systems
    - Access MySQL shell
        - `mysql -u root -p` and type the password you've set up during installation
    - Add yourself as an admin user to MySQL server
        - `CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';`
            - If you want to set up user without password, leave password area as empty string.  Not specifying `IDENTIFIED BY` part will cause trouble in accessing database when on a SQL browser.
        - `GRANT ALL PRIVILEGES ON \*.\* TO 'newuser'@'localhost';`
2. Set up a Python 3 virtual environment
    - Create virtual environment at the designated directory
        - `python3 -m venv <directory_to_the_new_virtual_env>`
    - Start using the virtual environment
        - `source <directory_to_the_new_virtual_env>/bin/activate`
    - Upgrade PIP
        - `pip install --upgrade pip`
    - Install required Python packages
        - `pip install -r requirements.txt`
    - Set up `PYTHONPATH` in `activate` file
        - Add a line `export PYTHONPATH="<directory_to_Backend_folder>" at the end of `activate` file
        - This is a temporary solution for resolving Backend module imports; will need to exchange it with `setup.py` later

## Note
- If you cannot access the local MySQL server with the SQL browser, try the following [solution](https://stackoverflow.com/questions/49194719/authentication-plugin-caching-sha2-password-cannot-be-loaded)
