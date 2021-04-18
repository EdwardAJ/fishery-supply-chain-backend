import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { Response } from "~/models/response.model"
import { User } from "~/models/blockchain/base/user.model"

import { logger } from "~/utils/logger.util"
import { isOrgNameExist } from "~/utils/organization.util"
import { createOrUpdateProductLot, getProductLotAndEnsureOwnership } from "~/utils/activities/product-lot.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getAndValidateUser } from "~/utils/user.util"
import { createOrUpdateActivitiesChain } from "~/utils/activities/activity.util"
import { getGeneratedUuid } from "~/utils/uuid.util"

import { TransferActivity } from "~/models/blockchain/transfer/transfer-activity.model"

const transfer = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username)

      const { currentLot: { id: currentLotId }, toOrganization } = req.body
      if (!currentLotId) { throw new Error("Please provide lot information") }
      if (!isOrgNameExist(toOrganization)) {
        return sendErrorResponse(res, "Organization does not exist!")
      }

      const currentProductLot = await getProductLotAndEnsureOwnership(currentLotId, user)
      currentProductLot.ActivityId = getGeneratedUuid()

      const transferActivity = new TransferActivity({
        id: currentProductLot.ActivityId,
        parentIds: [currentProductLot.ActivityId],
        owner: new User(null, toOrganization),
        createdAt: new Date().toISOString(),
        lot: currentProductLot,
      }, new User(user.username, user.organization))

      await createOrUpdateProductLot(currentProductLot, user)
      await createOrUpdateActivitiesChain(
        currentProductLot.ActivitiesChainId, [transferActivity], user)
      return sendSuccessResponse(res, "Transferred!", { activity: transferActivity })

    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  transfer
}