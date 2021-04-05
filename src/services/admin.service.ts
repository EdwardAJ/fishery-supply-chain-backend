import { AdminModel } from "~/models/admin.model"
import { AdminInterface } from "~/interfaces/admin.interface"

const insertAdmin =
  async (adminUsername: string, hashedPassword: string):Promise<void> => {
  const admin: AdminInterface = {
    username: adminUsername,
    hashed_password: hashedPassword
  }
  return await AdminModel.create(admin)
}

const getAdminByUsername = async (adminUsername: string): Promise<AdminInterface> => {
  const admin: AdminInterface = await AdminModel.findOne({ username: adminUsername })
  return admin
}

export {
  insertAdmin,
  getAdminByUsername
}