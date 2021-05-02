
import { Context } from "fabric-contract-api"
import { User } from "../models/base/user.model"
import { UsersContract } from "../users.contract"

const getAndValidateUser = async (context: Context, username: string, organization?: string): Promise<User> => {
  const usersContract = new UsersContract()
  const user = await usersContract.getUserByUsername(context, username)
  if (organization && user.Organization !== organization) {
    throw new Error("Forbidden!")
  }
  return user
}

export {
  getAndValidateUser
}