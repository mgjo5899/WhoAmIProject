FROM ubuntu:latest

RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get install -y build-essential sqlite3 libsqlite3-dev vim 
RUN apt-get install -y python3-pip python3-dev
RUN pip3 install --upgrade pip
RUN sqlite3 database.db

# Adding Backend folder to the 
ADD Backend /Backend

RUN cd Backend && pip3 install -r requirements.txt

# Setting Flask related environment variables
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

WORKDIR /Backend

RUN sqlite3 db/userdata.db < db/schema.sql

ENTRYPOINT ["python3", "app.py"]
