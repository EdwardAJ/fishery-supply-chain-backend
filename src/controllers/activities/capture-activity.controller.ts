import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { CaptureActivity } from "~/models/blockchain/capture/capture-activity.model"
import { User } from "~/models/blockchain/base/user.model"
import { Vessel } from "~/models/blockchain/capture/vessel.model"
import { Harbor } from "~/models/blockchain/capture/harbor.model"
import { GPSLocation } from "~/models/blockchain/base/gps-location.model"
import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"

import { getGeneratedUuid } from "~/utils/uuid.util"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { invoke } from "~/services/invoke.service"
import { getUserByUsername } from "~/services/user.service"
import { OrgNames } from "~/constants/organization.constant"
import { ActivitiesChain } from "~/models/blockchain/base/activities-chain.model"

const captureFisheryProduct = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string

      const user = await getUserByUsername(username)
      if (!user || user.organization !== OrgNames.ORG_1)
        return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)

      const {
        location: { latitude, longitude },
        fishery_product: {weight, commodity_type: commodityType},
        vessel: { id: vesselId, name: vesselName },
        harbor: { id: harborId, name: harborName }
      } = req.body

      const activitiesChainId = getGeneratedUuid()
      const currentLot = new FisheryProductLot(
        getGeneratedUuid(), weight, commodityType, activitiesChainId
      )

      const captureActivity = new CaptureActivity(
        {
          id: getGeneratedUuid(),
          parentIds: null,
          currentLot,
          location: new GPSLocation(latitude, longitude),
          owner: new User(username, user.organization),
          createdAt: new Date().toISOString(),
        },
        new Vessel(vesselId, vesselName),
        new Harbor(harborId, harborName),
      )

      const activitiesChain = new ActivitiesChain(
        activitiesChainId, [captureActivity]
      )

      await invoke(
        user.organization, username,
        "ProductLotsContract", "createProductLot",
        currentLot.Id, JSON.stringify(currentLot),
      )

      await invoke(
        user.organization, username,
        "ActivitiesChainsContract", "createActivitiesChain",
        activitiesChain.Id, JSON.stringify(activitiesChain)
      )

      return sendSuccessResponse(res, "Captured!", { activity: captureActivity })
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message)
    }
}

export {
  captureFisheryProduct
}