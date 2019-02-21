BACK_VERSION:=$(shell cat backend/VERSION)

all: clean build run

build: backend-build

clean:
	docker-compose down -v

run: database backend

database:
	docker-compose up -d database

backend:
	docker-compose up -d backend

backend-build:
	docker build -t whoamiproject_backend:${BACK_VERSION} backend/

.PHONY: all build clean run database backend frontend
.PHONY: backend-build frontend-build
