/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { Codes } from "~/constants/http/code.constant"
import { sendErrorResponse } from "~/utils/response.util"
import { logger } from "~/utils/logger.util"


const authorizeToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] as string
  if (!token) { 
    return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, username) => {
    if (err || !username) {
      logger.error(`Error: ${err}`)
      return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)
    }
    logger.info(`Request sent by ${username}`)
    req.headers["username"] = username ? username.toString() : ""
    next()
  })
}

export {
  authorizeToken
}