
import { Context } from "fabric-contract-api"
import { ClientIdentity, Shim } from "fabric-shim"
import { OrgMspIdMap } from "../constants/organization.constant"
import { User } from "../models/base/user.model"
import { compare } from "bcrypt"

const isAuthorizedAndGetUser = (context: Context, organization: string): User => {
  const logger = Shim.newLogger("isAuthorizedAndGetUser")
  const user = getUser(context)
  logger.info(`User: ${user}`)
  if (user.Organization !== organization)
    throw new Error("Forbidden!")
  
  return user
}

const getUser = (context: Context): User => {
  const logger = Shim.newLogger("getUser")

  const clientId = new ClientIdentity(context.stub)
  const mspId = clientId.getMSPID()

  logger.debug(`ClientId: ${clientId}`)

  const username = clientId.getAttributeValue("username")
  logger.debug(`Username: ${username}`)
  const organization = OrgMspIdMap[mspId]
  logger.debug(`Organization: ${organization}`)
  const role = clientId.getAttributeValue("role")
  logger.debug(`Role: ${role}`)
  const hashedPassword = clientId.getAttributeValue("hashedPassword")
  logger.debug(`Hashed password: ${hashedPassword}`)

  return new User(username, organization, role, hashedPassword)
}

const arePasswordsSame =
  async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword)
}

export {
  getUser,
  isAuthorizedAndGetUser,
  arePasswordsSame
}