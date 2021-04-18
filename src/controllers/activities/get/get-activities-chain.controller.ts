import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { query } from "~/services/query.service"
import { getAndValidateUser } from "~/utils/user.util"
import { getProductLotFromBlockchain } from "~/utils/activities/product-lot.util"

const getActivitiesChainHistoryByLotId = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const { lotId } = req.params
      if (!lotId) return sendErrorResponse(res, "Please provide lot ID!")

      // TODO: remove authentication method, automatically assign user to any organization
      // to see activities
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username)

      const productLot = await getProductLotFromBlockchain(user, lotId)
      const activitiesChainHistoryBuffer =
        await query(
          user, "ActivitiesChainsContract", "getActivitiesChainHistory",
          productLot.ActivitiesChainId)
      
      return sendSuccessResponse(res, "activities",
        JSON.parse(activitiesChainHistoryBuffer.toString()))
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  getActivitiesChainHistoryByLotId
}