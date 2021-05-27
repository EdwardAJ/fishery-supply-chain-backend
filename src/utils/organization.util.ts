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
    case OrgNames.ORG_4: {
      return process.env.ORG4_ADMIN as string
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
    case OrgNames.ORG_4: {
      return process.env.APP_ADMIN_ORG4 as string
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
    case OrgNames.ORG_4: {
      return process.env.ORG4_PASSWORD as string
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
    case OrgNames.ORG_4: {
      return OrgDomains.ORG_4
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
    case OrgNames.ORG_4: {
      return OrgMspIds.ORG_4
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

const getOrgConnectionFileName = (orgMspId: string, peerNumber = 0): string => {
  const orgNumber = getOrgNumber(orgMspId)
  return `connection-peer${peerNumber}-${orgNumber}.json`
}

const getOrgAffiliation = (orgMspId: string): string => {
  const orgNumber = getOrgNumber(orgMspId)
  return `${orgNumber}.department1`
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
  getAppOrgAdminUsername,
  getOrgAffiliation,
  getOrgCredentials,
  getOrgConnectionFileName
}