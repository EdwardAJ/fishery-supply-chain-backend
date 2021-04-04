import { Request, Response as ExpressResponse } from "express"
import { Response } from "models/response.model"

import { sendErrorResponse, sendSuccessResponse } from "utils/response.util"
import { adminExists } from "utils/wallet.util"
import { getOrgAdminUsername, isAdminOrderer } from "utils/organization.util"
import { getHashedPassword, getGeneratedPassword } from "utils/password.util"
import { logger } from "utils/logger.util"
import { signAndGetToken } from "utils/jwt.util"

import { Codes } from "constants/http/code.constant"
import { insertAdmin } from "services/admin.service"

// Enroll admins for org1 or org2 or org3.
// Prerequisite: orderer admin must be enrolled first.
const enrollAdmin = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
  try {
    const ordererAdminUsername = req.headers["username"] as string
    const isCurrentUserAnOrdererAdmin =
      isAdminOrderer(ordererAdminUsername) && await adminExists(ordererAdminUsername)
    
    if (!isCurrentUserAnOrdererAdmin)
      return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)

    const { orgName } = req.body
    const orgAdminUsername = getOrgAdminUsername(orgName)
    const hashedGeneratedPassword = await getHashedPassword(getGeneratedPassword())

    // TODO: Enroll admin to fabric
    await insertAdmin(orgAdminUsername, hashedGeneratedPassword)
    const jwtToken = signAndGetToken(orgAdminUsername)
    return sendSuccessResponse(
      res, `${orgAdminUsername} successfully enrolled!`, { token: jwtToken })
    
  } catch (error) {
    logger.error(error)
    return sendErrorResponse(res, error.message)
  }
}

export {
  enrollAdmin
}