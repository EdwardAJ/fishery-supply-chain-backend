import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { OrgNames } from "~/constants/organization.constant"

import { CaptureActivity } from "~/models/blockchain/capture/capture-activity.model"
import { User } from "~/models/blockchain/base/user.model"
import { Vessel } from "~/models/blockchain/capture/vessel.model"
import { Harbor } from "~/models/blockchain/capture/harbor.model"
import { GPSLocation } from "~/models/blockchain/base/gps-location.model"
import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"

import { getGeneratedUuid } from "~/utils/uuid.util"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getAndValidateUser } from "~/utils/user.util"
import { createOrUpdateActivitiesChain } from "~/utils/activities/activity.util"

import { invoke } from "~/services/invoke.service"

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
      const captureActivityId = getGeneratedUuid()

      const currentLot = new FisheryProductLot(
        { id: getGeneratedUuid(), weight, commodityType,
          activitiesChainId, activityId: captureActivityId }
      )

      const captureActivity = new CaptureActivity(
        {
          id: captureActivityId,
          parentIds: null,
          currentLot,
          owner: new User(username, user.organization),
          createdAt: new Date().toISOString(),
        },
        new Vessel(vesselId, vesselName),
        new Harbor(harborId, harborName),
        new GPSLocation(latitude, longitude)
      )

      await invoke(
        user, "ProductLotsContract", "createProductLot",
        currentLot.Id, JSON.stringify(currentLot))
      
        createOrUpdateActivitiesChain(activitiesChainId, [captureActivity], user)

      // TODO: save the activity to MongoDB

      return sendSuccessResponse(res, "Captured!", { activity: captureActivity })
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code)
    }
}

export {
  capture
}