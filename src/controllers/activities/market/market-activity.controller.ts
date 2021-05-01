import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { Response } from "~/models/response.model"
import { GPSLocation } from "~/models/blockchain/base/gps-location.model"
import { MarketTo } from "~/models/blockchain/market/market-to.model"

import { logger } from "~/utils/logger.util"
import { createOrUpdateActivitiesChain } from "~/utils/activities/activity.util"
import { createOrUpdateProductLot, getProductLotAndEnsureOwnership } from "~/utils/activities/product-lot.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getAndValidateUser } from "~/utils/user.util"
import { getGeneratedUuid } from "~/utils/uuid.util"

import { OrgNames } from "~/constants/organization.constant"
import { MarketActivity } from "~/models/blockchain/market/market-activity.model"
import { User } from "~/models/blockchain/base/user.model"

const market = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username, OrgNames.ORG_3)

      const {
        currentLot: { id: currentLotId },
        location: { latitude, longitude },
        marketTo: { id: marketToId, name: marketToName }
      } = req.body

      if (!currentLotId || !latitude || !longitude || !marketToId || !marketToName) {
        throw new Error("Please provide sufficient information")
      }

      const currentProductLot = await getProductLotAndEnsureOwnership(currentLotId, user)
      currentProductLot.Owner = new User(user.username, user.organization)

      const parentActivityId = currentProductLot.ActivityId

      const newActivityId = getGeneratedUuid()
      currentProductLot.ActivityId = newActivityId

      const marketActivity = new MarketActivity({
          id: newActivityId,
          parentIds: [parentActivityId],
          createdAt: new Date().toISOString(),
          lot: currentProductLot,
        },
        new MarketTo(marketToId, marketToName),
        new GPSLocation(latitude, longitude)
      )

      await createOrUpdateProductLot(currentProductLot, user)
      await createOrUpdateActivitiesChain(
        currentProductLot.ActivitiesChainId, [marketActivity], user)
      return sendSuccessResponse(res, "Processed!", { activity: marketActivity })

    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  market
}