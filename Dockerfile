FROM node:14

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

ARG ORG
RUN echo ${ORG}

COPY . /home/node/app
COPY blockchain/test-network/organizations/peerOrganizations/${ORG}.example.com/connection-peer0-${ORG}.json /home/node/app/connection-peer0-${ORG}.json
COPY blockchain/test-network/organizations/peerOrganizations/${ORG}.example.com/connection-peer1-${ORG}.json /home/node/app/connection-peer1-${ORG}.json
