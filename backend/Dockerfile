FROM python:3.7-alpine

RUN apk add --no-cache bash

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV VERSION=0.0.1

ADD Pipfile* /tmp/
RUN pip install pipenv
RUN cd /tmp && \
    pipenv install --system

WORKDIR /tmp

COPY dist/whoami-backend-${VERSION}.tar.gz ./
RUN tar xopf whoami-backend-${VERSION}.tar.gz
RUN pip install --no-cache whoami-backend-${VERSION}.tar.gz

RUN mv whoami-backend-${VERSION}/whoami_back /backend

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ADD wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

ENTRYPOINT ["/entrypoint.sh"]
