import { Request, Response as ExpressResponse } from "express"
import { Response } from "~/models/response.model"
import { logger } from "~/utils/logger.util"
import { signAndGetJwt } from "~/utils/jwt.util"
import { sendSuccessResponse, sendErrorResponse } from "~/utils/response.util"
import { query } from "~/services/query.service"

const login = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
  try {
    const { username, organization, password } = req.body || {}
    console.log("req body", req.body)
    if (!username || !organization || !password)
      return sendErrorResponse(res, "Username or organization or password is required")

    const userBuffer = await query(
      { username, organization },
      "UsersContract",
      "login",
      JSON.stringify(req.body)
    )

    const user = JSON.parse(userBuffer.toString())
    logger.info("user: %O", user)

    return sendSuccessResponse(res, "Login success!", {
      token: signAndGetJwt({ username, organization }),
      organization,
      role: user.role
    })
  } catch (error) {
    logger.error(error)
    return sendErrorResponse(res, error.message)
  }
}

export { login }
