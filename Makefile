VERSION:=$(shell cat VERSION)

all: stop build run

build: backend-build frontend-build

clean: backend-clean database-clean frontend-clean

run: database backend frontend

empty: backend-empty frontend-empty

database:
	docker-compose up -d database

backend:
	docker-compose up -d backend

frontend:
	docker-compose up -d frontend

backend-build:
	cd backend && pipenv run python setup.py sdist
	docker build -t whoamiproject_backend:${VERSION} backend/

frontend-build:
	docker build -t whoamiproject_frontend:${VERSION} frontend/

backend-clean:
	-docker stop whoamiproject_backend_1
	-docker rm whoamiproject_backend_1
	rm -rf backend/dist
	rm -rf backend/whoami_backend.egg-info

database-clean:
	-docker stop whoamiproject_database_1
	-docker rm whoamiproject_database_1

frontend-clean:
	-docker stop whoamiproject_frontend_1
	-docker rm whoamiproject_frontend_1

backend-empty: backend-clean
	-docker rmi whoamiproject_backend:${VERSION}

frontend-empty: frontend-clean
	-docker rmi whoamiproject_frontend:${VERSION}

.PHONY: all build stop run clean database backend frontend
.PHONY: backend-build frontend-build backend-clean database-clean
.PHONY: frontend-clean backend-empty frontend-empty
