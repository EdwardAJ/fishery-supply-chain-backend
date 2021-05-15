export PEER1_ORG1_CA=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt
export PEER1_ORG2_CA=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt
export PEER1_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls/ca.crt

echo "blockfile..."
echo $BLOCKFILE

echo "docker dir..."
echo ${PWD}/docker/docker-compose-peers.yaml

echo "docker peers..."
echo ${PWD}/docker/docker-compose-couch-peers.yaml

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


function joinChannelAndInstallChaincodePeer1Org1 () {
  export CORE_PEER_LOCALMSPID="Org1MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_ORG1_CA
  export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  export CORE_PEER_ADDRESS=localhost:8051
  peer channel join -b $BLOCKFILE
  echo "Installing chaincode on peer1org1...."
  set -x
  peer lifecycle chaincode install basic.tar.gz
  res=$?
  { set +x; } 2>/dev/null
}

function joinChannelAndInstallChaincodePeer1Org2 () {
  export CORE_PEER_LOCALMSPID="Org2MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_ORG2_CA
  export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
  export CORE_PEER_ADDRESS=localhost:10051
  peer channel join -b $BLOCKFILE
  echo "Installing chaincode on peer1org2...."
  set -x
  peer lifecycle chaincode install basic.tar.gz
  res=$?
  { set +x; } 2>/dev/null
}

function joinChannelAndInstallChaincodePeer1Org3 () {
  export CORE_PEER_LOCALMSPID="Org3MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_ORG3_CA
  export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
  export CORE_PEER_ADDRESS=localhost:12051
  peer channel join -b $BLOCKFILE
  echo "Installing chaincode on peer1org3...."
  set -x
  peer lifecycle chaincode install basic.tar.gz
  res=$?
  { set +x; } 2>/dev/null
}

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P1PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ${PWD}/organizations/ccp-template-peer1.json
}

echo "Enrolling peer1.org1: "
enrollPeer1Org1
echo "Enrolling peer1.org2: "
enrollPeer1Org2
echo "Enrolling peer1.org3: "
enrollPeer1Org3

IMAGETAG="latest"
IMAGE_TAG=$IMAGETAG docker-compose -f ${PWD}/docker/docker-compose-peers.yaml -f ${PWD}/docker/docker-compose-couch-peers.yaml up -d 2>&1

echo "Joining and installing channel peer1.org1: "
joinChannelAndInstallChaincodePeer1Org1
echo "Joining channel peer1.org2: "
joinChannelAndInstallChaincodePeer1Org2
echo "Joining channel peer1.org3: "
joinChannelAndInstallChaincodePeer1Org3



# ORG=1
# P1PORT=8051
# CAPORT=7054
# PEERPEM=${PWD}/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
# CAPEM=${PWD}/organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem

# echo "$(json_ccp $ORG $P1PORT $CAPORT $PEERPEM $CAPEM)" > ${PWD}/organizations/peerOrganizations/org1.example.com/connection-peer1-org1.json

# ORG=2
# P1PORT=10051
# CAPORT=8054
# PEERPEM=${PWD}/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
# CAPEM=${PWD}/organizations/peerOrganizations/org2.example.com/ca/ca.org2.example.com-cert.pem

# echo "$(json_ccp $ORG $P1PORT $CAPORT $PEERPEM $CAPEM)" > ${PWD}/organizations/peerOrganizations/org2.example.com/connection-peer1-org2.json

# ORG=3
# P1PORT=12051
# CAPORT=11054
# PEERPEM=${PWD}/organizations/peerOrganizations/org3.example.com/tlsca/tlsca.org3.example.com-cert.pem
# CAPEM=${PWD}/organizations/peerOrganizations/org3.example.com/ca/ca.org3.example.com-cert.pem

# echo "$(json_ccp $ORG $P1PORT $CAPORT $PEERPEM $CAPEM)" > ${PWD}/organizations/peerOrganizations/org3.example.com/connection-peer1-org3.json


