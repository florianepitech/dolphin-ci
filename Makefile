##
## OTOPILOT, 2022
## Otopilot Makefile
## File description:
## Generic Makefile for Otopilot Website
##

#=================================
#	Variables
#=================================

APP_NAME 	= test-webhook

APP_VERSION = 1.0

DOCKER_NAME = $(APP_NAME):$(APP_VERSION)

DOCKER_REMOTE = otopilot/test-webhook

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
					all

# Start the react app in development mode
all:
					npm start

#	Production

run-prod:
					npm install
					make build-react
					export NODE_ENV=prod && node app.js

docker-build:
					docker build --file Dockerfile --tag $(DOCKER_NAME) .

docker-run:			docker-build
					docker run --detach --publish 80:80 --publish 443:443 $(DOCKER_NAME)

docker-push:
					docker build --platform=linux/amd64 -t $(DOCKER_NAME) .
					docker tag $(DOCKER_NAME) $(DOCKER_REMOTE):$(APP_VERSION)
					docker push $(DOCKER_REMOTE):$(APP_VERSION)
					docker push $(DOCKER_REMOTE):$(APP_VERSION)

#	Certificates
certbot-create:
					sudo certbot certonly --domain $(DOMAIN),www.$(DOMAIN) --standalone

certbot-delete:
					sudo rm -rf /etc/letsencrypt/live/* /etc/letsencrypt/archive/* /etc/letsencrypt/renewal/*

certbot-renew:
					sudo certbot certonly renew

#	Bundle

build-react:
					npm run build
