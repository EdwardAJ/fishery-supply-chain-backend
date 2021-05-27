import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { Response } from "~/models/response.model"

import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { getGeneratedUuid } from "~/utils/uuid.util"
import { invoke } from "~/services/invoke.service"


const process = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string
      const organization = req.headers["organization"] as string
      const newActivityId = getGeneratedUuid()

      const processActivityBuffer =
        await invoke(
          req,
          { username, organization }, "ActivityContract", "process",
          JSON.stringify({
            ...req.body,
            createdAt: new Date().toISOString(),
            newActivityId
          })
        )
      
      const processActivity = JSON.parse(processActivityBuffer.toString())
      return sendSuccessResponse(res, "Processed!", { activity: processActivity })

    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  process
}