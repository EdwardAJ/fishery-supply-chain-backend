FROM node:14-alpine

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY . /home/node/app
COPY ./blockchain/test-network/organizations/peerOrganizations/org2.example.com/connection-peer0-org2.json /home/node/app/connection-peer0-org2.json
COPY ./blockchain/test-network/organizations/peerOrganizations/org2.example.com/connection-peer1-org2.json /home/node/app/connection-peer1-org2.json
