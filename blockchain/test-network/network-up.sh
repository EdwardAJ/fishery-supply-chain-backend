export ORDERER_PASSWORD=$(cat ${PWD}/.env | grep ORDERER_PASSWORD= | cut -d '=' -f2)
export ORG1_PASSWORD=$(cat ${PWD}/.env | grep ORG1_PASSWORD= | cut -d '=' -f2)
export ORG2_PASSWORD=$(cat ${PWD}/.env | grep ORG2_PASSWORD= | cut -d '=' -f2)
export ORG3_PASSWORD=$(cat ${PWD}/.env | grep ORG3_PASSWORD= | cut -d '=' -f2)
export ORG4_PASSWORD=$(cat ${PWD}/.env | grep ORG4_PASSWORD= | cut -d '=' -f2)
export ORG1_ADMIN=$(cat ${PWD}/.env | grep ORG1_ADMIN= | cut -d '=' -f2)
export ORG2_ADMIN=$(cat ${PWD}/.env | grep ORG2_ADMIN= | cut -d '=' -f2)
export ORG3_ADMIN=$(cat ${PWD}/.env | grep ORG3_ADMIN= | cut -d '=' -f2)
export ORG4_ADMIN=$(cat ${PWD}/.env | grep ORG4_ADMIN= | cut -d '=' -f2)
export ORDERER_ADMIN=$(cat ${PWD}/.env | grep ORDERER_ADMIN= | cut -d '=' -f2)

export FABRIC_CFG_PATH=$PWD/../config/
export CHANNEL_NAME="channel1"
export BLOCKFILE="$PWD/channel-artifacts/${CHANNEL_NAME}.block"
export CORE_PEER_TLS_ENABLED=true

# ./network.sh up createChannel -c channel1 -ca -s couchdb
./network.sh up createChannel -c channel1 -ca
cd addOrg3
# ./addOrg3.sh up -c channel1 -ca -s couchdb
./addOrg3.sh up -c channel1 -ca
cd ..
cd addOrg4
# ./addOrg4.sh up -c channel1 -ca -s couchdb
./addOrg4.sh up -c channel1 -ca
cd ..
./network.sh deployCC -c channel1 -ccn basic -ccp ../../chaincode -ccl typescript -ccep "OutOf(2,'Org1MSP.member','Org2MSP.member','Org3MSP.member')"
. scripts/addPeers.sh

setAnchorPeer() {
  ORG=$1
  docker exec cli ./scripts/setAnchorPeer.sh $ORG $CHANNEL_NAME
}

echo "Setting anchor peer for peer1.org1..."
setAnchorPeer 11

echo "Setting anchor peer for peer1.org2..."
setAnchorPeer 12

echo "Setting anchor peer for peer1.org3..."
setAnchorPeer 13

echo "Setting anchor peer for peer1.org4..."
setAnchorPeer 14