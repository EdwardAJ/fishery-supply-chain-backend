import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { Response } from "~/models/response.model"

import { registerUserToBlockchain } from "~/services/register-user.service"

import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { logger } from "~/utils/logger.util"
import { getGeneratedPassword, getHashedPassword } from "~/utils/password.util"
import { OrgRoles } from "~/constants/organization.constant"

// Prerequisite: org admin must be enrolled first.
const registerUser = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
  try {
    const adminOrganization = req.headers["organization"] as string
    const role = req.headers["role"] as string

    const { username, organization } = req.body
    if (adminOrganization !== organization || role !== OrgRoles.ADMIN) {
      return sendErrorResponse(res, "Forbidden!", Codes.FORBIDDEN)
    }

    const generatedPassword = getGeneratedPassword()
    const hashedPassword = await getHashedPassword(generatedPassword)
  
    await registerUserToBlockchain(adminOrganization, username, hashedPassword)
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