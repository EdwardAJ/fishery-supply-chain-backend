import { OrgNames, OrgDomains, OrgMspIds } from "~/constants/organization.constant"
import { OrgCredentialsInterface } from "~/interfaces/organization.interface"

const getBlockchainOrgAdminUsername = (orgName: string): string => {
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

const getAppOrgAdminUsername = (orgName: string): string => {
  switch (orgName) {
    case OrgNames.ORG_1: {
      return process.env.APP_ADMIN_ORG1 as string
    }
    case OrgNames.ORG_2: {
      return process.env.APP_ADMIN_ORG2 as string
    }
    case OrgNames.ORG_3: {
      return process.env.APP_ADMIN_ORG3 as string
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
  console.log("mspId: ", orgMspId)
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

// const isAdminOrderer = (ordererAdminUsername: string): boolean => {
//   return process.env.ORDERER_ADMIN === ordererAdminUsername
// }

const isAppAdminOrg1 = (org1AppAdminUsername: string): boolean => {
  return process.env.APP_ADMIN_ORG1 === org1AppAdminUsername
}

const isAppAdminOrg2 = (org2AppAdminUsername: string): boolean => {
  return process.env.APP_ADMIN_ORG2 === org2AppAdminUsername
}

const isAppAdminOrg3 = (org3AppAdminUsername: string): boolean => {
  return process.env.APP_ADMIN_ORG3 === org3AppAdminUsername
}

const getAppAdminOrganization = (adminUsername: string): string | null => {
  if (isAppAdminOrg1(adminUsername)) return OrgNames.ORG_1
  if (isAppAdminOrg2(adminUsername)) return OrgNames.ORG_2
  if (isAppAdminOrg3(adminUsername)) return OrgNames.ORG_3
  return null
}

const isOrgNameExist = (orgName: string): boolean => {
  return orgName === OrgNames.ORG_1 || orgName === OrgNames.ORG_2 || orgName === OrgNames.ORG_3
}

const getOrgCredentials = (orgName: string): OrgCredentialsInterface => {
  return {
    adminUsername: getBlockchainOrgAdminUsername(orgName),
    password: getOrgPassword(orgName),
    domain: getOrgDomain(orgName),
    mspId: getOrgMspId(orgName)
  }
}

export {
  getBlockchainOrgAdminUsername,
  getAppOrgAdminUsername,
  getOrgDomain,
  getOrgMspId,
  getOrgAffiliation,
  getOrgCredentials,
  getOrgConnectionFileName,
  getOrgPassword,
  isOrgNameExist,
  getAppAdminOrganization
}