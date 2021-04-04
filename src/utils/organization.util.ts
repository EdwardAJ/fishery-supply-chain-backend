import { OrgNames } from "constants/organization.constant"

// TODO: add ORG_3, ORG_4 checking
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

const isAdminOrderer = (ordererAdminUsername: string): boolean => {
  return process.env.ORDERER_ADMIN === ordererAdminUsername
}

export {
  getOrgAdminUsername,
  isAdminOrderer
}