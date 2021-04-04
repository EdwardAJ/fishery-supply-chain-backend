import { Schema, model } from "mongoose"
import { ModelNames } from "constants/model.constant"

const schema = new Schema({
  username: { type: String, required: true },
  hashed_password: { type: String, required: true }
})

const AdminModel = model(ModelNames.ADMIN, schema)
export { AdminModel }