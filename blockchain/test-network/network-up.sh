export ORDERER_PASSWORD=$(cat ${PWD}/../../.env | grep ORDERER_PASSWORD= | cut -d '=' -f2)
export ORG1_PASSWORD=$(cat ${PWD}/../../.env | grep ORG1_PASSWORD= | cut -d '=' -f2)
export ORG2_PASSWORD=$(cat ${PWD}/../../.env | grep ORG2_PASSWORD= | cut -d '=' -f2)
export ORG3_PASSWORD=$(cat ${PWD}/../../.env | grep ORG3_PASSWORD= | cut -d '=' -f2)
export ORG1_ADMIN=$(cat ${PWD}/../../.env | grep ORG1_ADMIN= | cut -d '=' -f2)
export ORG2_ADMIN=$(cat ${PWD}/../../.env | grep ORG2_ADMIN= | cut -d '=' -f2)
export ORG3_ADMIN=$(cat ${PWD}/../../.env | grep ORG3_ADMIN= | cut -d '=' -f2)
export ORDERER_ADMIN=$(cat ${PWD}/../../.env | grep ORDERER_ADMIN= | cut -d '=' -f2)

export FABRIC_CFG_PATH=$PWD/../config/
export CHANNEL_NAME="channel1"
export BLOCKFILE="$PWD/channel-artifacts/${CHANNEL_NAME}.block"
export CORE_PEER_TLS_ENABLED=true

./network.sh up createChannel -c channel1 -ca -s couchdb
cd addOrg3
./addOrg3.sh up -c channel1 -ca -s couchdb
cd ..
./network.sh deployCC -c channel1 -ccn basic -ccp ../../chaincode -ccl typescript -ccep "AND('Org1MSP.member','Org2MSP.member','Org3MSP.member')"
. scripts/addPeers.sh

setAnchorPeer() {
  ORG=$1
  docker exec cli ./scripts/setAnchorPeer.sh $ORG $CHANNEL_NAME
}

echo "Setting anchor peer for peer1.org1..."
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_ORG1_CA
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer1.org1.example.com:8051
setAnchorPeer 11

echo "Setting anchor peer for peer1.org2..."
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_ORG2_CA
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=peer1.org2.example.com:10051
setAnchorPeer 12

echo "Setting anchor peer for peer1.org3..."
export CORE_PEER_LOCALMSPID="Org3MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_ORG3_CA
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
export CORE_PEER_ADDRESS=peer1.org2.example.com:12051
setAnchorPeer 13