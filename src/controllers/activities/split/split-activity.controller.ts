import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"

import { getAndValidateUser } from "~/utils/user.util"
import {  createOrUpdateActivitiesChain } from "~/utils/activities/activity.util"
import {
  createOrUpdateProductLot, getNewProductLots,
  getProductLotAndEnsureOwnership
} from "~/utils/activities/product-lot.util"
import { SplitActivity } from "~/models/blockchain/split/split-activity.model"
import { User } from "~/models/blockchain/base/user.model"

const split = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username)

      const { currentLot: { id: currentLotId }, newLots } = req.body
      if (!currentLotId || !newLots?.length) {
        throw new Error("Please provide lot information")
      }

      const { ActivitiesChainId: activitiesChainId, ActivityId: activityId } = 
        await getProductLotAndEnsureOwnership(currentLotId, user)
 
      const newProductLots = getNewProductLots(newLots, activitiesChainId)
      const splitActivities: SplitActivity[] = []

      await Promise.all(newProductLots.map(async (newProductLot) => {
        splitActivities.push(
          new SplitActivity(
            {
              id: newProductLot.ActivityId,
              parentIds: [activityId],
              lot: newProductLot,
              owner: new User(user.username, user.organization),
              createdAt: new Date().toISOString(),
            }
          )
        )
        await createOrUpdateProductLot(newProductLot, user)
      }))

      await createOrUpdateActivitiesChain(activitiesChainId, splitActivities, user)
      return sendSuccessResponse(res, "Splitted!", { activities: splitActivities })

    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  split
}