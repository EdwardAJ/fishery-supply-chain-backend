import { sign } from "jsonwebtoken"

const signAndGetJwt = (username: string): string => {
  return sign({ username }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
}

export {
  signAndGetJwt
}