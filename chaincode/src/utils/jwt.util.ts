import { sign, verify } from "jsonwebtoken"

const signAndGetJwt = (username: string): string => {
  return sign({ username }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
}

const verifyJwtAndGetUsername = (token: string): string => {
  try {
    const username = verify(token, process.env.JWT_SECRET as string)
    return username as string
  } catch (err) {
    throw new Error("Wrong JWT!")
  }
}

export {
  signAndGetJwt,
  verifyJwtAndGetUsername
}