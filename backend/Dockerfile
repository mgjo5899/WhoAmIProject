FROM python:3.7.2-alpine3.8

WORKDIR /backend
ADD . .
RUN rm -rf .venv
RUN pip install --upgrade pip
RUN pip install pipenv
RUN pipenv --three
RUN pipenv run python setup.py sdist

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV VERSION=0.0.1

ADD Pipfile* ./
RUN pipenv install --system

ADD ./whoami_back ./

RUN apk update && apk add dos2unix && apk add bash

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ADD wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

RUN dos2unix /entrypoint.sh /wait-for-it.sh

ENTRYPOINT ["/entrypoint.sh"]
