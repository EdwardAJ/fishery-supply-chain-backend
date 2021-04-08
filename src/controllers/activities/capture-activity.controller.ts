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
import { getOrgName, isAdminOrg1 } from "~/utils/organization.util"
import { adminExists } from "~/utils/wallet.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { invoke } from "~/services/invoke.service"

const captureFisheryProduct = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const org1AdminUsername = req.headers["username"] as string
      const isCurrentUserAnOrg1Admin =
        isAdminOrg1(org1AdminUsername) && await adminExists(org1AdminUsername)

      if (!isCurrentUserAnOrg1Admin)
        return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)
      
      const {
        location: { latitude, longitude },
        fishery_product: {weight, commodity_type: commodityType},
        vessel: { id: vesselId, name: vesselName },
        harbor: { id: harborId, name: harborName }
      } = req.body

      const orgName = getOrgName(org1AdminUsername)
      const captureActivity = new CaptureActivity(
        getGeneratedUuid(),
        null,
        getGeneratedUuid(),
        new FisheryProductLot(
          getGeneratedUuid(), weight, commodityType
        ),
        new GPSLocation(latitude, longitude),
        new User(org1AdminUsername, orgName),
        new Vessel(vesselId, vesselName),
        new Harbor(harborId, harborName)
      )

      await invoke(orgName, "FisherySupplyChainContract", "createActivity", captureActivity)
      return sendSuccessResponse(res, "Captured!", { activity: captureActivity })
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message)
    }
}

export {
  captureFisheryProduct
}