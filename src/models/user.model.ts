import { Schema, model } from "mongoose"
import { ModelNames } from "~/constants/model.constant"

const schema = new Schema({
  username: { type: String, required: true },
  hashed_password: { type: String, required: true },
  role: { type: String, required: true },
  organization: { type: String, required: true }
})

const UserModel = model(ModelNames.USER, schema)
export { UserModel }