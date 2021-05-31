import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { query } from "~/services/query.service"
import { getAppOrgAdminUsername } from "~/utils/organization.util"

const getTotalWeight = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const { harborId, vesselId } = req.query
      if (!harborId && !vesselId) {
        return sendErrorResponse(res, "Please provide sufficient information!")
      }

      const username = getAppOrgAdminUsername()

      const queryString = {
        selector: {},
        fields: ["lot.weight"],
        use_index: ["_design/aggregationDoc", "aggregationQuery"]
      }

      if (harborId) {
        queryString.selector = {
          harbor: { id: harborId },
          name: "Penangkapan"
        }
      } else if (vesselId) {
        queryString.selector = {
          vessel: { id: vesselId },
          name: "Penangkapan"
        }
      }

      const totalWeightBuffer =
        await query(
          req,
          { username }, "ActivityContract", "getTotalWeightByQuery",
          JSON.stringify(queryString)
        )
      
      return sendSuccessResponse(res, "lots", JSON.parse(totalWeightBuffer.toString()))
      
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  getTotalWeight
}