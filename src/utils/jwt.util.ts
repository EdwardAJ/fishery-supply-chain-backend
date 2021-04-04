import { sign } from "jsonwebtoken"

const signAndGetJwt = (payload: string): string => {
  return sign(payload, process.env.JWT_SECRET as string)
}

export {
  signAndGetJwt
}