import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"
import { Codes } from "~/constants/http/code.constant"

import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"

import { getGeneratedUuid } from "~/utils/uuid.util"
import { invoke } from "~/services/invoke.service"

const split = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const username = req.headers["username"] as string

      const { newLots } = req.body
      if (!newLots.length) throw new Error("Please provide lot information")

      const newLotIds = []
      const newActivityIds = []

      for (let lotIndex = 0; lotIndex < newLots.length; lotIndex++) {
        newLotIds.push(getGeneratedUuid())
        newActivityIds.push(getGeneratedUuid())
      }

      const splitActivitiesBuffer =
        await invoke(
          req,
          { username }, "ActivityContract", "split",
          JSON.stringify({
            ...req.body,
            createdAt: new Date().toISOString(),
            newLotIds,
            newActivityIds
          })
        )

      const splitActivities = JSON.parse(splitActivitiesBuffer.toString())
      return sendSuccessResponse(res, "Splitted!", { activities: splitActivities })

    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  split
}