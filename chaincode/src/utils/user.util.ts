
import { Context } from "fabric-contract-api"
import { ClientIdentity, Shim } from "fabric-shim"
import { OrgMspIdMap } from "../constants/organization.constant"
import { User } from "../models/base/user.model"
import { compare } from "bcrypt"

const validateAndGetUser = (context: Context, organizations: string[]): User => {
  const logger = Shim.newLogger("isAuthorizedAndGetUser")
  const user = getUser(context)
  logger.info(`User: ${user}`)

  for (const organization of organizations) {
    if (user.Organization === organization) return user
  }

  throw new Error("Forbidden!") 
}

const getUser = (context: Context, includeHashedPassword = false): User => {
  const clientId = new ClientIdentity(context.stub)
  const mspId = clientId.getMSPID()
  const username = clientId.getAttributeValue("username")
  const organization = OrgMspIdMap[mspId]
  const role = clientId.getAttributeValue("role")

  if (includeHashedPassword) {
    const hashedPassword = clientId.getAttributeValue("hashedPassword")
    return new User(username, organization, role, hashedPassword)
  }
  return new User(username, organization, role)
}

const comparePasswordAndHashedPassword =
  async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword)
}


export {
  getUser,
  validateAndGetUser,
  comparePasswordAndHashedPassword
}