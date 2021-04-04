import { generate } from "generate-password"
import { hash } from "bcrypt"
import { SALT_ROUNDS } from "constants/password.constant"

const getGeneratedPassword = (): string => {
  return generate( { length : 10, numbers: true })
}

const getHashedPassword = async (password: string): Promise<string> => {
  const hashedPassword = await hash(password, SALT_ROUNDS)
  return hashedPassword
}

export {
  getGeneratedPassword,
  getHashedPassword
}