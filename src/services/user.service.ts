import { UserModel } from "~/models/user.model"
import { UserInterface } from "~/interfaces/admin.interface"

const insertUser =
  async (username: string, hashedPassword: string, role: string, organization: string):Promise<void> => {
  const user: UserInterface = {
    username,
    hashed_password: hashedPassword,
    role,
    organization
  }
  return await UserModel.create(user)
}

const getUserByUsername = async (username: string): Promise<UserInterface> => {
  const user: UserInterface = await UserModel.findOne({ username })
  return user
}

export {
  insertUser,
  getUserByUsername
}