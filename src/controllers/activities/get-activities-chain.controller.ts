import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getUserByUsername } from "~/services/user.service"
import { query } from "~/services/query.service"

const getActivitiesChainByLotId = async (req: Request, res: ExpressResponse):
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

      const productLotString = await query(orgName, username, "ProductLotsContract", "getProductLot", lotId)
      const productLot = JSON.parse(productLotString.toString())
      if (!productLot) {
        return sendErrorResponse(res, "Product lot does not exist")
      }

      const { activitiesChainId } = productLot
      const activitiesChain =
        await query(orgName, username, "ActivitiesChainsContract", "getActivitiesChainHistory", activitiesChainId)
      
      return sendSuccessResponse(res, "activities", JSON.parse(activitiesChain.toString()))
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message)
    }
}

export {
  getActivitiesChainByLotId
}