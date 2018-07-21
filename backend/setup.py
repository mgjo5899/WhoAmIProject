import os

from setuptools import setup, find_packages

project_root = os.path.abspath(os.path.dirname(__file__))
VERSION = open(os.path.join(project_root, 'VERSION')).read()

requires = [
    'blinker==1.4',
    'click==6.7',
    'Flask==1.0.2',
    'Flask-Cors==3.0.6',
    'Flask-Mail==0.9.1',
    'itsdangerous==0.24',
    'Jinja2==2.10',
    'MarkupSafe==1.0',
    'PyMySQL==0.8.1',
    'six==1.11.0',
    'SQLAlchemy==1.2.8',
    'SQLAlchemy-Utils==0.33.3',
    'Werkzeug==0.14.1'
]

setup(
    name='whoami-backend',
    version=VERSION,
    packages=find_packages(),
    include_package_data=True,
    install_requires=requires
)
