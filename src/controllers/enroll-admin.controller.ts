import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { Response } from "~/models/response.model"

import { insertAdmin } from "~/services/admin.service"
import { enrollAdminToBlockchain } from "~/services/enroll-admin.service"

import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { adminExists } from "~/utils/wallet.util"
import { getOrgAdminUsername, isAdminOrderer } from "~/utils/organization.util"
import { getHashedPassword, getGeneratedPassword } from "~/utils/password.util"
import { logger } from "~/utils/logger.util"
import { signAndGetJwt } from "~/utils/jwt.util"

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

    const orgName = req.body.org_name
    const orgAdminUsername = getOrgAdminUsername(orgName)
    if (orgAdminUsername === "")
      return sendErrorResponse(res, "Admin username not found")

    await enrollAdminToBlockchain(orgName)
    const generatedPassword = getGeneratedPassword()
    const hashedGeneratedPassword = await getHashedPassword(generatedPassword)
    
    await insertAdmin(orgAdminUsername, hashedGeneratedPassword)
    const jwt = signAndGetJwt(orgAdminUsername)
    return sendSuccessResponse(res, `${orgAdminUsername} successfully enrolled!`, {
      token: jwt,
      password: generatedPassword
    })
    
  } catch (error) {
    logger.error(error)
    return sendErrorResponse(res, error.message)
  }
}

export {
  enrollAdmin
}