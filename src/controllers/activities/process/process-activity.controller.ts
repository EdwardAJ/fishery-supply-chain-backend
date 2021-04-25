import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { Response } from "~/models/response.model"
import { ProcessActivity } from "~/models/blockchain/process/process-activity.model"
import { Supplier } from "~/models/blockchain/process/supplier.model"
import { ProcessTo } from "~/models/blockchain/process/process-to.model"
import { GPSLocation } from "~/models/blockchain/base/gps-location.model"
import { Storage } from "~/models/blockchain/process/storage.model"

import { logger } from "~/utils/logger.util"
import { createOrUpdateActivitiesChain } from "~/utils/activities/activity.util"
import { createOrUpdateProductLot, getProductLotAndEnsureOwnership } from "~/utils/activities/product-lot.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getAndValidateUser } from "~/utils/user.util"
import { getGeneratedUuid } from "~/utils/uuid.util"

import { OrgNames } from "~/constants/organization.constant"


const process = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username, OrgNames.ORG_2)

      const {
        currentLot: { id: currentLotId },
        supplier: { id: supplierId, name: supplierName },
        storage: { id: storageId, name: storageName },
        processTo: { id: processToId, name: processToName },
        location: { latitude, longitude },
      } = req.body

      if (!currentLotId || !supplierId || !supplierName ||
          !storageId || !storageName || !processToId ||
          !processToName || !latitude || !longitude) {
        throw new Error("Please provide sufficient information")
      }

      const currentProductLot = await getProductLotAndEnsureOwnership(currentLotId, user)
      const parentActivityId = currentProductLot.ActivityId

      const newActivityId = getGeneratedUuid()
      currentProductLot.ActivityId = newActivityId

      const processActivity = new ProcessActivity({
          id: newActivityId,
          parentIds: [parentActivityId],
          createdAt: new Date().toISOString(),
          lot: currentProductLot,
        },
        new Supplier(supplierId, supplierName),
        new Storage(storageId, storageName),
        new ProcessTo(processToId, processToName),
        new GPSLocation(latitude, longitude)
      )

      await createOrUpdateProductLot(currentProductLot, user)
      await createOrUpdateActivitiesChain(
        currentProductLot.ActivitiesChainId, [processActivity], user)
      return sendSuccessResponse(res, "Processed!", { activity: processActivity })

    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  process
}