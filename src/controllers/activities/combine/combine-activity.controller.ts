import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { Response } from "~/models/response.model"
import { CombineActivity } from "~/models/blockchain/combine/combine-activity.model"
import { User } from "~/models/blockchain/base/user.model"

import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getAndValidateUser } from "~/utils/user.util"
import { createOrUpdateActivitiesChain } from "~/utils/activities/activity.util"
import { getGeneratedUuid } from "~/utils/uuid.util"
import { createOrUpdateProductLot, getProductLotAndEnsureOwnership, getNewProductLot } from "~/utils/activities/product-lot.util"
import { ParentInterface } from "~/interfaces/parent.interface"

const combine = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username)

      const { currentLot: { ids: currentLotIds }, newLot } = req.body
      if (!currentLotIds?.length || !newLot) {
        throw new Error("Please provide lot information")
      }

      let parents: ParentInterface[] | null = []
      const activityIds: string[] = []
      const activitiesChainIdSet: Set<string> = new Set()

      for (const currentLotId of currentLotIds) {
        const { ActivitiesChainId: activitiesChainId, ActivityId: activityId } = 
          await getProductLotAndEnsureOwnership(currentLotId, user)
        activitiesChainIdSet.add(activitiesChainId)
        activityIds.push(activityId)
        parents.push({ activityId, activitiesChainId })
      }

      /* If the activitiesChainIdSet size is only 1, then the newActivitiesChainId
         should be the same as the parent's newActivitiesChainId (first element of set).
         Otherwise, make a new one. */
      let newActivitiesChainId = getGeneratedUuid()
      if (activitiesChainIdSet.size === 1) {
        // Get first element
        const iterator = activitiesChainIdSet.values()
        newActivitiesChainId = iterator.next().value
        parents = null
      }

      const newProductLot =
        getNewProductLot(
          newLot, newActivitiesChainId,
          new User(user.username, user.organization)
        )
      
      const combineActivity = new CombineActivity({
        id: newProductLot.ActivityId,
        parentIds: activityIds,
        createdAt: new Date().toISOString(),
        lot: newProductLot,
      }, parents)

      await createOrUpdateProductLot(newProductLot, user)
      await createOrUpdateActivitiesChain(newActivitiesChainId, [combineActivity], user)

      return sendSuccessResponse(res, "Combined!", { activity: combineActivity })
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  combine
}