import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { Response } from "~/models/response.model"
import { User } from "~/models/blockchain/base/user.model"

import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getAndValidateUser } from "~/utils/user.util"
import { getProductLotAndEnsureOwnership, updateActivitiesChain } from "~/utils/activities/activity.util"
import { getGeneratedUuid } from "~/utils/uuid.util"

import { invoke } from "~/services/invoke.service"
import { TransferActivity } from "~/models/blockchain/transfer/transfer-activity.model"
import { isOrgNameExist } from "~/utils/organization.util"

const transfer = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username)

      const { currentLot: { id: currentLotId }, toOrganization } = req.body

      if (!currentLotId) {
        throw new Error("Please provide lot information")
      }
      
      if (!isOrgNameExist(toOrganization)) {
        return sendErrorResponse(res, "Organization does not exist!")
      }

      const currentProductLot = 
        await getProductLotAndEnsureOwnership(currentLotId, user)
      
      await invoke(user, "ProductLotsContract", "createProductLot",
        currentProductLot.Id, JSON.stringify(currentProductLot)
      )

      const transferActivity = new TransferActivity({
        id: getGeneratedUuid(),
        parentIds: [currentProductLot.ActivityId],
        owner: new User(null, toOrganization),
        createdAt: new Date().toISOString(),
        currentLot: currentProductLot,
      }, new User(user.username, user.organization))

      await updateActivitiesChain(currentProductLot.ActivitiesChainId, [transferActivity], user)
      return sendSuccessResponse(res, "Transferred!", { activity: transferActivity })

    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  transfer
}