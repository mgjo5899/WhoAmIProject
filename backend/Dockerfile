FROM python:3.6-alpine

RUN apk add --no-cache bash

EXPOSE 8000

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN mkdir /backend
WORKDIR /backend

ADD . .

RUN pip install -r requirements.txt

RUN mv entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN mv wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

ENTRYPOINT ["/entrypoint.sh"]
