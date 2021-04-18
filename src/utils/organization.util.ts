import { OrgNames, OrgDomains, OrgMspIds } from "~/constants/organization.constant"
import { OrgCredentialsInterface } from "~/interfaces/organization.interface"

const getOrgAdminUsername = (orgName: string): string => {
  switch (orgName) {
    case OrgNames.ORG_1: {
      return process.env.ORG1_ADMIN as string
    }
    case OrgNames.ORG_2: {
      return process.env.ORG2_ADMIN as string
    }
    case OrgNames.ORG_3: {
      return process.env.ORG3_ADMIN as string
    }
    case OrgNames.ORG_ORDERER: {
      return process.env.ORDERER_ADMIN as string
    }
    default: return ""
  }
}

const getOrgName = (orgAdminUsername: string): string => {
  switch (orgAdminUsername) {
    case process.env.ORG1_ADMIN: {
      return OrgNames.ORG_1
    }
    case process.env.ORG2_ADMIN: {
      return OrgNames.ORG_2
    }
    case process.env.ORG3_ADMIN: {
      return OrgNames.ORG_3
    }
    case process.env.ORDERER_ADMIN: {
      return OrgNames.ORG_ORDERER
    }
    default: return ""
  }
}

const getOrgPassword = (orgName: string): string => {
  switch (orgName) {
    case OrgNames.ORG_1: {
      return process.env.ORG1_PASSWORD as string
    }
    case OrgNames.ORG_2: {
      return process.env.ORG2_PASSWORD as string
    }
    case OrgNames.ORG_3: {
      return process.env.ORG3_PASSWORD as string
    }
    case OrgNames.ORG_ORDERER: {
      return process.env.ORDERER_PASSWORD as string
    }
    default: return ""
  }
}

const getOrgDomain = (orgName: string): string => {
  switch (orgName) {
    case OrgNames.ORG_1: {
      return OrgDomains.ORG_1
    }
    case OrgNames.ORG_2: {
      return OrgDomains.ORG_2
    }
    case OrgNames.ORG_3: {
      return OrgDomains.ORG_3
    }
    case OrgNames.ORG_ORDERER: {
      return OrgDomains.ORG_ORDERER
    }
    default: return ""
  }
}

const getOrgMspId = (orgName: string): string => {
  switch (orgName) {
    case OrgNames.ORG_1: {
      return OrgMspIds.ORG_1
    }
    case OrgNames.ORG_2: {
      return OrgMspIds.ORG_2
    }
    case OrgNames.ORG_3: {
      return OrgMspIds.ORG_3
    }
    case OrgNames.ORG_ORDERER: {
      return OrgMspIds.ORG_ORDERER
    }
    default: return ""
  }
}

// Remove "MSP" characters (last three characters) from orgMspId, 
// then lowercase the string
const getOrgNumber = (orgMspId: string): string => {
  return orgMspId.slice(0, -3).toLowerCase()
}

const getOrgConnectionFileName = (orgMspId: string): string => {
  const orgNumber = getOrgNumber(orgMspId)
  return `connection-${orgNumber}.json`
}

const getOrgAffiliation = (orgMspId: string): string => {
  const orgNumber = getOrgNumber(orgMspId)
  return `${orgNumber}.department1`
}

const isAdminOrderer = (ordererAdminUsername: string): boolean => {
  return process.env.ORDERER_ADMIN === ordererAdminUsername
}

const isAdminOrg1 = (org1AdminUsername: string): boolean => {
  return process.env.ORG1_ADMIN === org1AdminUsername
}

const isAdminOrg2 = (org2AdminUsername: string): boolean => {
  return process.env.ORG2_ADMIN === org2AdminUsername
}

const isAdminOrg3 = (org3AdminUsername: string): boolean => {
  return process.env.ORG3_ADMIN === org3AdminUsername
}

const isAdminOfOrganization = (adminUsername: string): boolean => {
  return isAdminOrg1(adminUsername) || isAdminOrg2(adminUsername) || isAdminOrg3(adminUsername)
}

const isOrgNameExist = (orgName: string): boolean => {
  return orgName === OrgNames.ORG_1 || orgName === OrgNames.ORG_2 || orgName === OrgNames.ORG_3
}

const getOrgCredentials = (orgName: string): OrgCredentialsInterface => {
  return {
    adminUsername: getOrgAdminUsername(orgName),
    password: getOrgPassword(orgName),
    domain: getOrgDomain(orgName),
    mspId: getOrgMspId(orgName)
  }
}

export {
  getOrgAdminUsername,
  getOrgName,
  getOrgDomain,
  getOrgMspId,
  getOrgAffiliation,
  getOrgCredentials,
  getOrgConnectionFileName,
  getOrgPassword,
  isAdminOrderer,
  isAdminOrg1,
  isAdminOrg2,
  isAdminOrg3,
  isOrgNameExist,
  isAdminOfOrganization
}