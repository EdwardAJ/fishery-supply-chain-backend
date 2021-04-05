import { Request, Response as ExpressResponse } from "express"
import { Response } from "~/models/response.model"
import { getAdminByUsername } from "~/services/admin.service"
import { logger } from "~/utils/logger.util"
import { arePasswordsSame } from "~/utils/password.util"
import { signAndGetJwt } from "~/utils/jwt.util"
import { sendSuccessResponse, sendErrorResponse } from "~/utils/response.util"
import { Codes } from "~/constants/http/code.constant"

const login = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
  try {
    const { username, password } = req.body || {}
    if (!username || !password)
      return sendErrorResponse(res, "Username or password is required")

    const admin = await getAdminByUsername(username)
    if (!admin) return sendErrorResponse(res, "Admin not found", Codes.UNAUTHORIZED)
    
    const { hashed_password: hashedPassword } = admin
    if (!await arePasswordsSame(password, hashedPassword))
      return sendErrorResponse(res, "Wrong password", Codes.UNAUTHORIZED)

    return sendSuccessResponse(res, "Login success!", {
      token: signAndGetJwt(username)
    })
  } catch (error) {
    logger.error(error)
    return sendErrorResponse(res, error.message)
  }
}

export { login }
