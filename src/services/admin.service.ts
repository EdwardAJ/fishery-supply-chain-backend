import { AdminModel } from "models/admin.model"
import { AdminInterface } from "interfaces/admin.interface"

const insertAdmin =
  async (adminUsername: string, hashedPassword: string):Promise<void> => {
  const admin: AdminInterface = {
    username: adminUsername,
    hashed_password: hashedPassword
  }
  return await AdminModel.create(admin)
}

export {
  insertAdmin
}