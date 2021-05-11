 ./network.sh up createChannel -c channel1 -ca -s couchdb
 cd addOrg3
 ./addOrg3.sh up -c channel1 -ca -s couchdb
 ./network.sh deployCC -c channel1 -ccn basic -ccp ../../chaincode -ccl typescript -ccep "AND('Org1MSP.member','Org2MSP.member','Org3MSP.member')"
