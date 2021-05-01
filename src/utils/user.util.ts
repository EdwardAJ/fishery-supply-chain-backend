
import { Codes } from "~/constants/http/code.constant"
import { UserInterface } from "~/interfaces/user.interface"
import { CustomError } from "~/models/error/custom-error.model"
import { getUserByUsername } from "~/services/user.service"

const getAndValidateUser = async (username: string, orgName?: string): Promise<UserInterface> => {
  const user = await getUserByUsername(username)
  if (!user)
    throw new CustomError("Unauthorized", Codes.UNAUTHORIZED)
  if (orgName && user.organization !== orgName)
    throw new CustomError("Unauthorized", Codes.UNAUTHORIZED)
  return user
}

export {
  getAndValidateUser
}