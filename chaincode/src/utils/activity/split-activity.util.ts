import { Context } from "fabric-contract-api"
import { OrgNames } from "../../constants/organization.constant"
import { SplitRequestInterface } from "../../interfaces/request/requests.interface"
import { User } from "../../models/base/user.model"
import { validateAndGetUser } from "../user.util"

const getValidatedUserAndSplitRequest = (context: Context, requestBody: string): {
  user: User, request: SplitRequestInterface
} => {
  const user = validateAndGetUser(context, [OrgNames.ORG_1, OrgNames.ORG_2, OrgNames.ORG_3])
  const splitRequest = JSON.parse(requestBody) as SplitRequestInterface
  validateSplitRequest(splitRequest)
  return {
    request: splitRequest,
    user
  }
}

const validateSplitRequest = (splitRequest: SplitRequestInterface): void => {
  const { currentLot, newLots } = splitRequest
  if (!currentLot?.id || !newLots.length) {
    throw new Error("Please provide lot information")
  }
}

export {
  getValidatedUserAndSplitRequest,
  validateSplitRequest
}