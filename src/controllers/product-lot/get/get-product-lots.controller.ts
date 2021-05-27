import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { query } from "~/services/query.service"
import { getAppOrgAdminUsername } from "~/utils/organization.util"
import { OrgNames } from "~/constants/organization.constant"

const getProductLots = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const { harborId, vesselId } = req.query
      if (!harborId && !vesselId) {
        return sendErrorResponse(res, "Please provide sufficient information!")
      }

      const username = getAppOrgAdminUsername(OrgNames.ORG_4)
      const organization = OrgNames.ORG_4

      const queryString = { selector: {}, fields: ["lot.commodityType", "lot.weight"] }

      if (harborId) {
        queryString.selector = { harbor: { id: harborId } }
      } else if (vesselId) {
        queryString.selector = { vessel: { id: vesselId } }
      }

      const productLotsBuffer =
        await query(
          req,
          { username, organization }, "ActivityContract", "getProductLotsByQuery",
          JSON.stringify(queryString)
        )
      
      return sendSuccessResponse(res, "lots",
        JSON.parse(productLotsBuffer.toString()))
      
    } catch (error) {
      logger.error(error)
      return sendErrorResponse(res, error.message, error.code ?? Codes.BAD_REQUEST)
    }
}

export {
  getProductLots
}