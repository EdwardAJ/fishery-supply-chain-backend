import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { Response } from "~/models/response.model"

import { registerUserToBlockchain } from "~/services/register-user.service"

import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getAppAdminOrganization } from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"
import { getGeneratedPassword, getHashedPassword } from "~/utils/password.util"


// Prerequisite: org admin must be enrolled first.
const registerUser = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
  try {
    const adminUsername = req.headers["username"] as string

    const appAdminOrganization = getAppAdminOrganization(adminUsername)
    if (!appAdminOrganization)
      return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)

    const { username, orgName } = req.body
    if (appAdminOrganization !== orgName) {
      return sendErrorResponse(res, "Forbidden!", Codes.FORBIDDEN)
    }

    const generatedPassword = getGeneratedPassword()
    const hashedPassword = await getHashedPassword(generatedPassword)
  
    await registerUserToBlockchain(orgName, username, hashedPassword)
    return sendSuccessResponse(res, `${username} successfully registered!`, {
      password: generatedPassword
    })
    
  } catch (error) {
    logger.error(error)
    return sendErrorResponse(res, error.message)
  }
}

export {
  registerUser
}