/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import logger from 'utils/logger.util'

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['Authorization'] as string
  const token = authHeader?.split(' ')[1]
  if (!token) return res.sendStatus(401)
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      logger.error(err)
      return res.sendStatus(401)
    }
    logger.info(`Request sent by ${user}`)
    next()
  })
}

export {
  authenticateToken
}