import { Request, Response as ExpressResponse } from "express"
import { Response } from "~/models/response.model"

import { logger } from "~/utils/logger.util"
import { signAndGetJwt } from "~/utils/jwt.util"
import { sendSuccessResponse, sendErrorResponse } from "~/utils/response.util"
import { getOrgName } from "~/utils/organization.util"

import { query } from "~/services/query.service"
import { getWallet, validateWallet } from "~/utils/wallet.util"

import { gateways, connect } from "~/gateway/index"

const login = async (req: Request, res: ExpressResponse): Promise<ExpressResponse<Response>> => {
  try {
    const { username, password } = req.body || {}
    if (!username || !password)
      return sendErrorResponse(res, "Username or password is required")

    const wallet = await getWallet()
    await validateWallet(wallet, username)

    if (gateways[username] === undefined) {
      const ccp = req.app.locals[`PEER_${req.app.locals.ACTIVE_PEER_NUMBER}_CCP`]
      await connect(ccp, wallet, username)
    }

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
