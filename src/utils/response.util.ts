import { Statuses } from "~/constants/http/status.constant"
import { Codes } from "~/constants/http/code.constant"
import { Response as ExpressResponse } from "express"
import { Response } from "../models/response.model"

const getSuccessResponse = (message: string, data ?: unknown): Response => {
  return new Response(Statuses.SUCCESS, message, data)
}

const getErrorResponse = (message: string): Response => {
  return new Response(Statuses.ERROR, message)
}

const sendSuccessResponse = (
  res: ExpressResponse, message: string,
  data ?: unknown, statusCode = Codes.SUCCESS
): ExpressResponse<Response> => {
  const body = getSuccessResponse(message, data)
  return res.status(statusCode).send(body)
}

const sendErrorResponse = (
  res: ExpressResponse, message: string, statusCode = Codes.BAD_REQUEST
): ExpressResponse<Response> => {
  const body = getErrorResponse(message)
  return res.status(statusCode).send(body)
}

export {
  sendSuccessResponse,
  sendErrorResponse
}