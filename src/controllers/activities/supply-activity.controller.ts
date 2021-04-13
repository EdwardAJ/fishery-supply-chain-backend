/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { getGeneratedUuid } from "~/utils/uuid.util"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getUserByUsername, insertUser } from "~/services/user.service"
import { OrgNames } from "~/constants/organization.constant"
import { SupplyActivity } from "~/models/blockchain/supply/supply-activity.model"

import {
  validateLotInformation, getCurrentLots, getParentActivityIds,
  splitLotsAndGetActivities, updateLotAndGetActivities, updateActivitiesChain
} from "~/utils/activities/supply-activity.util"
import { getAndValidateUser } from "~/utils/user.util"

// Specify the transfer type in the payload
// type = NORMAL: handle one lotId payload, normal supply chain
// type = SPLIT: split case: get multiple new lots information, make lotIds based on it, then split
// type = COMBINE: combine case: merge multiple lotIds to one

const supplyFisheryProduct = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username, OrgNames.ORG_2)

      const { current_lot: { ids: currentLotIds }, new_lots: newLots } = req.body
      validateLotInformation(currentLotIds, newLots)

      const currentLots = await getCurrentLots(currentLotIds, user)
      const supplyActivityId = getGeneratedUuid()
      const parentActivityIds: string[] = getParentActivityIds(currentLots)
      const activitiesChainId = currentLots[0].ActivitiesChainId

      let supplyActivities: SupplyActivity[] = []
      newLots?.length > 0 ?
        supplyActivities = await splitLotsAndGetActivities(
          req, activitiesChainId, supplyActivityId, parentActivityIds, user)
        :
        supplyActivities = await updateLotAndGetActivities(
          req, currentLots[0], supplyActivityId, parentActivityIds, user)

      await updateActivitiesChain(activitiesChainId, supplyActivities, user)
      return sendSuccessResponse(res, "Supplied!", { activities: supplyActivities })

    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  supplyFisheryProduct
}