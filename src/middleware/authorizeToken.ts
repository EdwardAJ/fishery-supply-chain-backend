/* eslint-disable @typescript-eslint/no-explicit-any */
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

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user: any) => {
    logger.info("Request sent by %O", user)
    if (err || !user?.username || !user?.organization || !user?.role) {
      logger.error(`Error: ${err}`)
      return sendErrorResponse(res, "Unauthorized", Codes.UNAUTHORIZED)
    }
    req.headers["username"] = user.username
    req.headers["organization"] = user.organization
    req.headers["role"] = user.role
    next()
  })
}

export {
  authorizeToken
}