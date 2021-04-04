import { sign } from "jsonwebtoken"

const signAndGetToken = async (payload: string): Promise<string> => {
  return sign(payload, process.env.JWT_SECRET as string)
}

export {
  signAndGetToken
}