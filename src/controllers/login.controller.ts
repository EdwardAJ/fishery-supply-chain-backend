import { Request, Response as ExpressResponse } from "express"
import { Response } from "~/models/response.model"
import { logger } from "~/utils/logger.util"
import { signAndGetJwt } from "~/utils/jwt.util"
import { sendSuccessResponse, sendErrorResponse } from "~/utils/response.util"
import { query } from "~/services/query.service"

const login = async (req: Request, res: ExpressResponse): Promise<ExpressResponse<Response>> => {
  try {
    const { username, organization, password } = req.body || {}
    if (!username || !organization || !password)
      return sendErrorResponse(res, "Username or organization or password is required")

    const userBuffer = await query(
      req,
      { username, organization }, "UserContract", "login",
      JSON.stringify(req.body)
    )

    const { role } = JSON.parse(userBuffer.toString())
    return sendSuccessResponse(res, "Login success!", {
      token: signAndGetJwt({ username, organization, role }),
      organization,
      role
    })

  } catch (error) {
    logger.error(error)
    return sendErrorResponse(res, error.message)
  }
}

export { login }
