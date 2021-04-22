import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { OrgNames } from "~/constants/organization.constant"

import { CaptureActivity } from "~/models/blockchain/capture/capture-activity.model"
import { User } from "~/models/blockchain/base/user.model"
import { Vessel } from "~/models/blockchain/capture/vessel.model"
import { Harbor } from "~/models/blockchain/capture/harbor.model"
import { GPSLocation } from "~/models/blockchain/base/gps-location.model"

import { getGeneratedUuid } from "~/utils/uuid.util"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getAndValidateUser } from "~/utils/user.util"
import { createOrUpdateActivitiesChain } from "~/utils/activities/activity.util"
import { createOrUpdateProductLot, getNewProductLot } from "~/utils/activities/product-lot.util"

const capture = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username, OrgNames.ORG_1)

      const {
        location: { latitude, longitude },
        fisheryProduct: {weight, commodityType},
        vessel: { id: vesselId, name: vesselName },
        harbor: { id: harborId, name: harborName }
      } = req.body

      const activitiesChainId = getGeneratedUuid()
      console.log("activitiesChainId: ", activitiesChainId)

      const newProductLot = getNewProductLot({weight, commodityType}, activitiesChainId)
      console.log("activityId: ", newProductLot.ActivityId)
      console.log("lotId: ", newProductLot.Id)
      const captureActivity = new CaptureActivity(
        {
          id: newProductLot.ActivityId,
          parentIds: null,
          lot: newProductLot,
          owner: new User(username, user.organization),
          createdAt: new Date().toISOString(),
        },
        new Vessel(vesselId, vesselName),
        new Harbor(harborId, harborName),
        new GPSLocation(latitude, longitude)
      )

      await createOrUpdateProductLot(newProductLot, user)
      await createOrUpdateActivitiesChain(activitiesChainId, [captureActivity], user)

      return sendSuccessResponse(res, "Captured!", { activity: captureActivity })
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code)
    }
}

export {
  capture
}