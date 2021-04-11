import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { OrgRoles } from "~/constants/organization.constant"
import { Response } from "~/models/response.model"

import { insertUser } from "~/services/user.service"
import { registerUserToBlockchain } from "~/services/register-user.service"

import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { isAdminOfOrganization } from "~/utils/organization.util"
import { logger } from "~/utils/logger.util"
import { getHashedPassword } from "~/utils/password.util"


// Prerequisite: org admin must be enrolled first.
const registerUser = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
  try {
    const adminUsername = req.headers["username"] as string

    if (!isAdminOfOrganization(adminUsername))
      return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)

    const { username, org_name: orgName } = req.body
    const userPassword = await registerUserToBlockchain(orgName, username)

    const hashedPassword = await getHashedPassword(userPassword)
    await insertUser(username, hashedPassword, OrgRoles.USER, orgName)

    return sendSuccessResponse(res, `${username} successfully registered!`, {
      password: userPassword
    })
    
  } catch (error) {
    logger.error(error)
    return sendErrorResponse(res, error.message)
  }
}

export {
  registerUser
}