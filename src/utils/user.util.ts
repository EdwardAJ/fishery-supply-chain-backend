
import { UserInterface } from "~/interfaces/user.interface"
import { getUserByUsername } from "~/services/user.service"

const getAndValidateUser = async (username: string, orgName: string): Promise<UserInterface> => {
  const user = await getUserByUsername(username)
  if (!user || user.organization !== orgName)
    throw new Error("Unauthorized")
  return user
}

export {
  getAndValidateUser
}