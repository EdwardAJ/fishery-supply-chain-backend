import { Request, Response as ExpressResponse } from "express"
import { Response } from "~/models/response.model"

import { logger } from "~/utils/logger.util"
import { signAndGetJwt } from "~/utils/jwt.util"
import { sendSuccessResponse, sendErrorResponse } from "~/utils/response.util"
import { getOrgName } from "~/utils/organization.util"

import { query } from "~/services/query.service"

const login = async (req: Request, res: ExpressResponse): Promise<ExpressResponse<Response>> => {
  try {
    const { username, password } = req.body || {}
    if (!username || !password)
      return sendErrorResponse(res, "Username or password is required")

    const requestBody = { ...req.body, organization: getOrgName() }

    const userBuffer = await query(
      req, { username }, "UserContract", "login",
      JSON.stringify(requestBody)
    )

    const { role } = JSON.parse(userBuffer.toString())
    return sendSuccessResponse(res, "Login success!", {
      token: signAndGetJwt({ username, role }),
      role
    })

  } catch (error) {
    logger.error(error)
    return sendErrorResponse(res, error.message)
  }
}

export { login }
