FROM python:3.7 as builder

WORKDIR /tmp
ADD . .
RUN rm -rf .venv
RUN pip install --upgrade pip
RUN pip install pipenv
RUN pipenv --three
RUN pipenv run python setup.py sdist

FROM python:3.7

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV VERSION=0.0.1

ADD Pipfile* /tmp/
RUN pip install --upgrade pip
RUN pip install pipenv
RUN cd /tmp && \
    pipenv install --system

WORKDIR /tmp

COPY --from=builder /tmp/dist/whoami_back-${VERSION}.tar.gz ./
RUN tar xopf whoami_back-${VERSION}.tar.gz
RUN pip install --no-cache whoami_back-${VERSION}.tar.gz

RUN mv whoami_back-${VERSION}/whoami_back /backend

RUN apt-get update && apt-get install -y dos2unix

ADD entrypoint.sh /entrypoint.sh
RUN dos2unix /entrypoint.sh
RUN chmod +x /entrypoint.sh

ADD wait-for-it.sh /wait-for-it.sh
RUN dos2unix /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

ENTRYPOINT ["/entrypoint.sh"]
