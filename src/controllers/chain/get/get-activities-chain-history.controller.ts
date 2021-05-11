import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { query } from "~/services/query.service"

const getActivitiesChainHistory = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const { lotId } = req.query
      if (!lotId) {
        return sendErrorResponse(res, "Please provide lot ID!")
      }

      const username = req.headers["username"] as string
      const organization = req.headers["organization"] as string

      const activityChainBuffer =
        await query(
          { username, organization }, "ActivityContract", "getActivityChain",
          lotId.toString())
        
      const activityChain = JSON.parse(activityChainBuffer.toString())
      
      return sendSuccessResponse(res, "Chain successfully fetched!", {
        chain: activityChain
      })
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  getActivitiesChainHistory
}