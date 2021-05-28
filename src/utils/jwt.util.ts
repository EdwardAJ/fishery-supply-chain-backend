import { sign } from "jsonwebtoken"
import { UserInterface } from "~/interfaces/user.interface"

const signAndGetJwt = ({ username, role }: UserInterface): string => {
  return sign({ username, role }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
}

export {
  signAndGetJwt
}