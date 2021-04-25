import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { query } from "~/services/query.service"
import { getAndValidateUser } from "~/utils/user.util"
import { getProductLotFromBlockchain } from "~/utils/activities/product-lot.util"
import { getActivityChain } from "~/utils/activities/activity.util"

const getActivitiesChainHistory = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const { lotId, chainId, activityId: requestActivityId } = req.query
      if (!lotId && !(chainId && requestActivityId)) {
        return sendErrorResponse(res, "Please provide ID!")
      }

      // TODO: remove authentication method, automatically assign user to any organization
      // to see activities
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username)

      let activitiesChainId = ""
      let activityId = ""
      if (lotId) {
        const { ActivitiesChainId, ActivityId } =
          await getProductLotFromBlockchain(user, lotId.toString())
        activitiesChainId = ActivitiesChainId
        activityId = ActivityId
      } else if (chainId && requestActivityId) {
        activitiesChainId = chainId.toString()
        activityId = requestActivityId.toString()
      }

      const completeActivitiesChainHistoryBuffer =
        await query(
          user, "ActivitiesChainsContract", "getActivitiesChainHistory",
          activitiesChainId)
        
      const completeActivitiesChainHistory = JSON.parse(completeActivitiesChainHistoryBuffer.toString())
      const activityChain = getActivityChain(completeActivitiesChainHistory, activityId)
      
      return sendSuccessResponse(res, "Chain successfully fetched!", {
        parents: completeActivitiesChainHistory[0].activities[0]?.parents,
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