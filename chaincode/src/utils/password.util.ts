import { generate } from "generate-password"
import { compare, hash } from "bcrypt"
import { SALT_ROUNDS } from "../constants/password.constant"

const getGeneratedPassword = (): string => {
  return generate( { length : 10, numbers: true })
}

const getHashedPassword = async (password: string): Promise<string> => {
  return await hash(password, SALT_ROUNDS)
}

const arePasswordsSame =
  async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword)
}

export {
  getGeneratedPassword,
  getHashedPassword,
  arePasswordsSame
}