import { Context } from "fabric-contract-api"
import { OrgNames } from "../../constants/organization.constant"
import { LotAndActivityInterface } from "../../interfaces/base/lot-and-activity.interface"
import { TransferRequestInterface } from "../../interfaces/request/requests.interface"
import { User } from "../../models/base/user.model"
import { TransferActivity } from "../../models/transfer/transfer-activity.model"
import { getLotAndEnsureOwnership } from "../fishery-product-lot.util"
import { validateAndGetUser } from "../user.util"

const validateTransferRequest = (
  { currentLot: { id: currentLotId }, toOrganization, toUsername }: TransferRequestInterface
): void => {
  if (!currentLotId || !toUsername || !toOrganization)
    throw new Error("Please provide lot information")
  
  for (const organization in [OrgNames.ORG_1, OrgNames.ORG_2, OrgNames.ORG_3]) {
    if (toOrganization === organization) return
  }
  throw new Error("Organization does not exist!")
}

const getValidatedUserAndTransferRequest = (context: Context, requestBody: string): {
  user: User, request: TransferRequestInterface
} => {
  const user = validateAndGetUser(context, [OrgNames.ORG_1, OrgNames.ORG_2, OrgNames.ORG_3])
  const transferRequest = JSON.parse(requestBody) as TransferRequestInterface
  validateTransferRequest(transferRequest)
  return {
    request: transferRequest,
    user
  }
}

const getLotAndTransferActivity =
  async (context: Context, {
    currentLot: { id },
    toUsername, toOrganization,
    createdAt, newActivityId
  }: TransferRequestInterface, user: User):Promise<LotAndActivityInterface> => {
  
  const currentLot = await getLotAndEnsureOwnership(context, id, user)
  const parentActivityId = currentLot.ActivityId
  currentLot.ActivityId = newActivityId
  currentLot.Owner = new User(toUsername, toOrganization)

  const transferActivity = new TransferActivity({
    id: newActivityId, name: "Transfer", parentIds: [parentActivityId], createdAt, lot: currentLot
  }, user)

  return {
    lot: currentLot,
    activity: transferActivity
  }
}

export {
  getValidatedUserAndTransferRequest,
  validateTransferRequest,
  getLotAndTransferActivity
}