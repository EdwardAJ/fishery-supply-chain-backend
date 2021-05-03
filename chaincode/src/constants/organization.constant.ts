enum OrgNames {
  ORG_1 = "Pelabuhan",
  ORG_2 = "Unit Pengolahan Ikan (UPI)",
  ORG_3 = "Pemasar",
  ORG_ORDERER = "KKP RI"
}

enum OrgRoles {
  ADMIN = "admin",
  USER = "user",
  ORDERER = "orderer"
}

enum OrgMspIds {
  ORG_1 = "Org1MSP",
  ORG_2 = "Org2MSP",
  ORG_3 = "Org3MSP",
  ORG_ORDERER = "OrdererMSP"
}

const OrgMspIdMap = {
  [OrgNames.ORG_1]: OrgMspIds.ORG_1,
  [OrgNames.ORG_2]: OrgMspIds.ORG_2,
  [OrgNames.ORG_3]: OrgMspIds.ORG_3,
  [OrgNames.ORG_ORDERER]: OrgMspIds.ORG_ORDERER
}

export {
  OrgNames,
  OrgRoles,
  OrgMspIdMap
}