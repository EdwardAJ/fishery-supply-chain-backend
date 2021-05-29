#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp_peer1 {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P1PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ${PWD}/organizations/ccp-template-peer1.json
}

ORG=1
P1PORT=8051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem

echo "$(json_ccp_peer1 $ORG $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.example.com/connection-peer1-org1.json

ORG=2
P1PORT=10051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org2.example.com/ca/ca.org2.example.com-cert.pem

echo "$(json_ccp_peer1 $ORG $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org2.example.com/connection-peer1-org2.json

ORG=3
P1PORT=12051
CAPORT=11054
PEERPEM=organizations/peerOrganizations/org3.example.com/tlsca/tlsca.org3.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org3.example.com/ca/ca.org3.example.com-cert.pem

echo "$(json_ccp_peer1 $ORG $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org3.example.com/connection-peer1-org3.json

ORG=4
P1PORT=14051
CAPORT=13054
PEERPEM=organizations/peerOrganizations/org4.example.com/tlsca/tlsca.org4.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org4.example.com/ca/ca.org4.example.com-cert.pem

echo "$(json_ccp_peer1 $ORG $P1PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org4.example.com/connection-peer1-org4.json