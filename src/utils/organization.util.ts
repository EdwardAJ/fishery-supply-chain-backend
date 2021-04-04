import { OrgNames, OrgDomains, OrgMspIds } from "~/constants/organization.constant"

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
    case OrgNames.ORG_4: {
      return process.env.ORG4_ADMIN as string
    }
    case OrgNames.ORG_ORDERER: {
      return process.env.ORDERER_ADMIN as string
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

const getOrgConnectionFileName = (orgMspId: string): string => {
  // Remove "MSP" characters (last three characters) from orgMspId, 
  // then lowercase the string
  const orgNumber = orgMspId.slice(0, -3).toLowerCase()
  return `connection-${orgNumber}.json`
}

const isAdminOrderer = (ordererAdminUsername: string): boolean => {
  return process.env.ORDERER_ADMIN === ordererAdminUsername
}

export {
  getOrgAdminUsername,
  getOrgDomain,
  getOrgMspId,
  getOrgConnectionFileName,
  getOrgPassword,
  isAdminOrderer
}