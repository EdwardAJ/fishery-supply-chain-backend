enum OrgNames {
  ORG_1 = "Pelabuhan",
  ORG_2 = "Unit Pengolahan Ikan (UPI)",
  ORG_3 = "Pemasar",
  ORG_4 = "Publik",
  ORG_ORDERER = "KKP RI"
}

enum OrgDomains {
  ORG_1 = "org1.example.com",
  ORG_2 = "org2.example.com",
  ORG_3 = "org3.example.com",
  ORG_4 = "org4.example.com",
  ORG_ORDERER = "example.com"
}


enum OrgMspIds {
  ORG_1 = "Org1MSP",
  ORG_2 = "Org2MSP",
  ORG_3 = "Org3MSP",
  ORG_4 = "Org4MSP",
  ORG_ORDERER = "OrdererMSP"
}

enum OrgRoles {
  ADMIN = "admin",
  USER = "user"
}

export {
  OrgNames,
  OrgDomains,
  OrgMspIds,
  OrgRoles
}