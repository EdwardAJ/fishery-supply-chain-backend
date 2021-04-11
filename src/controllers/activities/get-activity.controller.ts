import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getUserByUsername } from "~/services/user.service"
import { query } from "~/services/query.service"

const getActivitiesByLotId = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const { lotId } = req.params
      if (!lotId) return sendErrorResponse(res, "Please provide lot ID!")

      // TODO: remove authentication method, automatically assign user to any organization
      // to see activities
      const username = req.headers["username"] as string
      const user = await getUserByUsername(username)
      if (!user) return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)

      const { organization: orgName } = user
      const activities =
        await query(orgName, username, "basic", "getActivities", JSON.stringify({
          selector: { currentLot: { id: lotId } }
        }))
      return sendSuccessResponse(res, "activities", activities)
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message)
    }
}

export {
  getActivitiesByLotId
}