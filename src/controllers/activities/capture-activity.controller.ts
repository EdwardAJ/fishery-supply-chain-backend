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

const captureFisheryProduct = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string

      const user = await getUserByUsername(username)
      if (!user)
        return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)

      const { organization: orgName } = user
      const {
        location: { latitude, longitude },
        fishery_product: {weight, commodity_type: commodityType},
        vessel: { id: vesselId, name: vesselName },
        harbor: { id: harborId, name: harborName }
      } = req.body

      const captureActivity = new CaptureActivity(
        getGeneratedUuid(),
        null,
        getGeneratedUuid(),
        new FisheryProductLot(
          getGeneratedUuid(), weight, commodityType
        ),
        new GPSLocation(latitude, longitude),
        new User(username, orgName),
        new Vessel(vesselId, vesselName),
        new Harbor(harborId, harborName)
      )

      await invoke(orgName, username, "basic", "createActivity", captureActivity)
      return sendSuccessResponse(res, "Captured!", { activity: captureActivity })
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message)
    }
}

export {
  captureFisheryProduct
}