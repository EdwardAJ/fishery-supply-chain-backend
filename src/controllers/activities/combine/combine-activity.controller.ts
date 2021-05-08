import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { Response } from "~/models/response.model"

import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getGeneratedUuid } from "~/utils/uuid.util"
import { invoke } from "~/services/invoke.service"

const combine = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const organization = req.headers["organization"] as string

      const newLotId = getGeneratedUuid()
      const newActivityId = getGeneratedUuid()

      const combineActivityBuffer =
        await invoke(
          { username, organization }, "ActivityContract", "combine",
          JSON.stringify({
            ...req.body,
            createdAt: new Date().toISOString(),
            newLotId,
            newActivityId
          })
        )

      const combineActivity = JSON.parse(combineActivityBuffer.toString())
      return sendSuccessResponse(res, "Combined!", { activity: combineActivity })
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  combine
}