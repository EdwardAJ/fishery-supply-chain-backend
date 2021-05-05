import { sign } from "jsonwebtoken"
import { UserInterface } from "~/interfaces/user.interface"

const signAndGetJwt = ({ username, organization }: UserInterface): string => {
  return sign({ username, organization }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
}

export {
  signAndGetJwt
}