BACK_VERSION:=$(shell cat backend/VERSION)
FRONT_VERSION:=$(shell cat frontend/VERSION)

all: clean build run

build: backend-build frontend-build

clean:
	docker-compose down -v

run: database backend frontend

database:
	docker-compose up -d database

backend:
	docker-compose up -d backend

frontend:
	docker-compose up -d frontend

backend-build:
	docker build -t whoamiproject_backend:${BACK_VERSION} backend/

frontend-build:
	docker build -t whoamiproject_frontend:${FRONT_VERSION} frontend/

.PHONY: all build clean run database backend frontend
.PHONY: backend-build frontend-build
