import { OrgCredentialsInterface } from "~/interfaces/organization.interface"

const getBlockchainOrgAdminUsername = (): string => {
  return process.env.ORG_ADMIN as string
}

const getAppOrgAdminUsername = (): string => {
  return process.env.APP_ADMIN as string
}

const getOrgPassword = (): string => {
  return process.env.ORG_PASSWORD as string
}

const getOrgDomain = (): string => {
  return process.env.ORG_DOMAIN as string
}

const getOrgMspId = (): string => {
  return process.env.ORG_MSP as string
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

const getOrgCredentials = (): OrgCredentialsInterface => {
  return {
    adminUsername: getBlockchainOrgAdminUsername(),
    password: getOrgPassword(),
    domain: getOrgDomain(),
    mspId: getOrgMspId()
  }
}

const getOrgName = (): string => {
  return process.env.ORG_NAME as string
}

export {
  getAppOrgAdminUsername,
  getOrgAffiliation,
  getOrgCredentials,
  getOrgConnectionFileName,
  getOrgName
}