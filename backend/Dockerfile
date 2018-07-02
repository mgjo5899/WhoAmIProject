FROM python:3.6

EXPOSE 8000

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN mkdir /backend

WORKDIR /backend

ADD . /backend/

RUN pip install -r requirements.txt
