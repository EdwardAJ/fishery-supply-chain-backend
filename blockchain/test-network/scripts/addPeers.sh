. ${PWD}/scripts/envVar.sh

function enrollPeer1Org1 () {
  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org1.example.com/
  fabric-ca-client register --caname ca-org1 --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  mkdir -p organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7054 --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp --csr.hosts peer1.org1.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  cp ${PWD}/organizations/peerOrganizations/org1.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp/config.yaml
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7054 --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls --enrollment.profile tls --csr.hosts peer1.org1.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  cp ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.key
}

function enrollPeer1Org2 () {
  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org2.example.com/
  fabric-ca-client register --caname ca-org2 --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  mkdir -p organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:8054 --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/msp --csr.hosts peer1.org2.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  cp ${PWD}/organizations/peerOrganizations/org2.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/msp/config.yaml
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:8054 --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls --enrollment.profile tls --csr.hosts peer1.org2.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  cp ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/server.key
}

function enrollPeer1Org3 () {
  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org3.example.com/
  fabric-ca-client register --caname ca-org3 --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/addOrg3/fabric-ca/org3/tls-cert.pem
  mkdir -p organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:11054 --caname ca-org3 -M ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/msp --csr.hosts peer1.org3.example.com --tls.certfiles ${PWD}/addOrg3/fabric-ca/org3/tls-cert.pem
  cp ${PWD}/organizations/peerOrganizations/org3.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/msp/config.yaml
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:11054 --caname ca-org3 -M ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls --enrollment.profile tls --csr.hosts peer1.org3.example.com --csr.hosts localhost --tls.certfiles ${PWD}/addOrg3/fabric-ca/org3/tls-cert.pem
  cp ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls/server.key
}

function enrollPeer1Org4 () {
  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org4.example.com/
  fabric-ca-client register --caname ca-org4 --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/addOrg4/fabric-ca/org4/tls-cert.pem
  mkdir -p organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:13054 --caname ca-org4 -M ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/msp --csr.hosts peer1.org4.example.com --tls.certfiles ${PWD}/addOrg4/fabric-ca/org4/tls-cert.pem
  cp ${PWD}/organizations/peerOrganizations/org4.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/msp/config.yaml
  fabric-ca-client enroll -u https://peer1:peer1pw@localhost:13054 --caname ca-org4 -M ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/tls --enrollment.profile tls --csr.hosts peer1.org4.example.com --csr.hosts localhost --tls.certfiles ${PWD}/addOrg4/fabric-ca/org4/tls-cert.pem
  cp ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/tls/server.key
}

function joinChannel() {
  ORG=$1
  setGlobals $ORG
  local rc=1
  local COUNTER=1
  ## Sometimes Join takes time, hence retry
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b $BLOCKFILE >&log.txt
    res=$?
    { set +x; } 2>/dev/null
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, peer1.org${ORG} has failed to join channel '$CHANNEL_NAME' "
}

function installChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode install basic.tar.gz >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode installation on peer1.org${ORG} has failed"
  successln "Chaincode is installed on peer1.org${ORG}"
}


echo "Enrolling peer1.org1: "
enrollPeer1Org1
echo "Enrolling peer1.org2: "
enrollPeer1Org2
echo "Enrolling peer1.org3: "
enrollPeer1Org3
echo "Enrolling peer1.org4: "
enrollPeer1Org4

IMAGETAG="latest"
IMAGE_TAG=$IMAGETAG

docker-compose -f ${PWD}/docker/docker-compose-peers.yaml -f ${PWD}/docker/docker-compose-couch-peers.yaml up -d 2>&1

export MAX_RETRY=5
export DELAY=3

echo "Joining channel peer1.org1: "
joinChannel 11
echo "Joining channel peer1.org2: "
joinChannel 12
echo "Joining channel peer1.org3: "
joinChannel 13
echo "Joining channel peer1.org4: "
joinChannel 14

echo "Install chaincode peer1.org1: "
installChaincode 11
echo "Install chaincode peer1.org2: "
installChaincode 12
echo "Install chaincode peer1.org3: "
installChaincode 13
echo "Install chaincode peer1.org4: "
installChaincode 14

./organizations/ccp-generate-peer1.sh
