import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { OrgRoles } from "~/constants/organization.constant"

import { Response } from "~/models/response.model"

import { insertUser } from "~/services/user.service"
import { enrollAdminToBlockchain } from "~/services/enroll-admin.service"

import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { adminExists } from "~/utils/wallet.util"
import { getOrgAdminUsername, isAdminOrderer } from "~/utils/organization.util"
import { getHashedPassword, getGeneratedPassword } from "~/utils/password.util"
import { logger } from "~/utils/logger.util"
import { registerUserToBlockchain } from "~/services/register-user.service"


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

    const orgName = req.body.orgName
    const orgAdminUsername = getOrgAdminUsername(orgName)
    if (orgAdminUsername === "")
      return sendErrorResponse(res, "Admin username not found")

    const generatedPassword = getGeneratedPassword()
    const hashedPassword = await getHashedPassword(generatedPassword)

    await registerUserToBlockchain(orgName, orgAdminUsername, hashedPassword, true)
    return sendSuccessResponse(res, `${orgAdminUsername} successfully enrolled!`, {
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