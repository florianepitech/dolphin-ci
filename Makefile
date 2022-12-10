##
## DOLPHIN CI, 2022
## Dolphin CI Makefile
## File description:
## Generic Makefile for Dolphin CI
##

#=================================
#	Variables
#=================================

APP_NAME 	= dolphin-ci

APP_VERSION = 1.0

DOCKER_USERNAME = root

DOCKER_PASSWORD = password

DOCKER_REGISTRY = registry.me:3000

DOCKER_NAME = $(APP_NAME):$(APP_VERSION)

DOCKER_REMOTE = dolphin-ci/dolphin-ci

#=================================
#	Commands
#=================================

.PHONY: 			docker-build \
					docker-run \
					docker-push \
					build-react \
					certbot-create \
					certbot-renew \
					certbot-delete \
					run-prod \
					run-dev \
					all

# Start the react app in development mode
all:
					npm start

#	Production

run-dev:
					yarn run dev

run-prod:
					npm install
					make build-react
					export NODE_ENV=prod && node app.js

docker-login:
					docker login $(DOCKER_REGISTRY) -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD)

docker-build:
					docker build --file Dockerfile --tag $(DOCKER_NAME) .

docker-run:			docker-build
					docker run --detach --publish 80:80 --publish 443:443 $(DOCKER_NAME)

# Create a image from the Dockerfile and push it to the registry at localhost:3000
docker-push:
					docker build --platform=linux/amd64 -t $(DOCKER_NAME) .
					docker tag $(DOCKER_NAME) $(DOCKER_REGISTRY)/$(DOCKER_REMOTE):$(APP_VERSION)
					docker push $(DOCKER_REGISTRY)/$(DOCKER_REMOTE):$(APP_VERSION)
					docker push $(DOCKER_REGISTRY)/$(DOCKER_REMOTE):$(APP_VERSION)
