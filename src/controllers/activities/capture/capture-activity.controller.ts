import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { invoke } from "~/services/invoke.service"
import { getGeneratedUuid } from "~/utils/uuid.util"

const capture = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const organization = req.headers["organization"] as string

      const newLotId = getGeneratedUuid()
      const newActivityId = getGeneratedUuid()

      const captureActivityBuffer =
        await invoke(
          { username, organization }, "ActivityContract", "capture",
          JSON.stringify({
            ...req.body,
            createdAt: new Date().toISOString(),
            newLotId,
            newActivityId
          })
        )

      const captureActivity = JSON.parse(captureActivityBuffer.toString())
      return sendSuccessResponse(res, "Captured!", { activity: captureActivity })
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code)
    }
}

export {
  capture
}