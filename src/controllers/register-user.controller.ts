import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { OrgRoles } from "~/constants/organization.constant"
import { Response } from "~/models/response.model"

import { insertUser } from "~/services/user.service"
import { registerUserToBlockchain } from "~/services/register-user.service"

import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getAdminOrganization } from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"
import { getGeneratedPassword, getHashedPassword } from "~/utils/password.util"


// Prerequisite: org admin must be enrolled first.
const registerUser = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
  try {
    const adminUsername = req.headers["username"] as string

    const adminOrganization = getAdminOrganization(adminUsername)
    if (!adminOrganization)
      return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)

    const { username, orgName } = req.body
    if (adminOrganization !== orgName) {
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