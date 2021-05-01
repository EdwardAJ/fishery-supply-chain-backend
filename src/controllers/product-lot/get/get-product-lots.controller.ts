import { Response } from "~/models/response.model"
import { Request, Response as ExpressResponse } from "express"

import { Codes } from "~/constants/http/code.constant"
import { logger } from "~/utils/logger.util"
import { sendErrorResponse, sendSuccessResponse } from "~/utils/response.util"
import { query } from "~/services/query.service"
import { getAndValidateUser } from "~/utils/user.util"

const getProductLots = async (req: Request, res: ExpressResponse):
  Promise<ExpressResponse<Response>> => {
    try {
      const { harborId, vesselId } = req.query
      if (!harborId && !vesselId) {
        return sendErrorResponse(res, "Please provide sufficient information!")
      }

      // TODO: remove authentication method, automatically assign user to any organization
      // to see activities
      const username = req.headers["username"] as string
      const user = await getAndValidateUser(username)

      let queryString = {}
      if (harborId) {
        queryString = { selector: { harbor: { id: harborId } } }
      } else if (vesselId) {
        queryString = { selector: { vessel: { id: vesselId } } }
      }

      const productLotsBuffer =
        await query(user, "ProductLotsContract", "getProductLotsByQuery",
          JSON.stringify(queryString))
      
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