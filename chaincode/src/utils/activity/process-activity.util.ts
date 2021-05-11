import { Context } from "fabric-contract-api"
import { OrgNames } from "../../constants/organization.constant"
import { LotAndActivityInterface } from "../../interfaces/base/lot-and-activity.interface"
import { ProcessRequestInterface } from "../../interfaces/request/requests.interface"
import { User } from "../../models/base/user.model"
import { ProcessActivity } from "../../models/process/process-activity.model"
import { getLotAndEnsureOwnership } from "../fishery-product-lot.util"
import { validateAndGetUser } from "../user.util"

const getValidatedUserAndProcessRequest = (context: Context, requestBody: string): {
  user: User, request: ProcessRequestInterface
} => {
  const user = validateAndGetUser(context, [OrgNames.ORG_2])
  const processRequest = JSON.parse(requestBody) as ProcessRequestInterface
  validateProcessRequest(processRequest)
  return {
    request: processRequest,
    user
  }
}

const validateProcessRequest = (processRequest: ProcessRequestInterface): void => {
  const {
    currentLot: { id: currentLotId },
    supplier: { id: supplierId, name: supplierName },
    storage: { id: storageId, name: storageName },
    processTo: { id: processToId, name: processToName },
    location: { latitude, longitude },
  } = processRequest
  
  if (!currentLotId || !supplierId || !supplierName ||
      !storageId || !storageName || !processToId ||
      !processToName || !latitude || !longitude) {
    throw new Error("Please provide sufficient information")
  }
}

const getLotAndProcessActivity =
  async (context: Context, processRequest: ProcessRequestInterface, user: User):Promise<LotAndActivityInterface> => {
  
  const {
    currentLot: { id: currentLotId },
    supplier,
    storage,
    processTo,
    location,
    newActivityId,
    createdAt
  } = processRequest

  const currentLot = await getLotAndEnsureOwnership(context, currentLotId, user)
  currentLot.Owner = new User(user.Username, user.Organization)
  
  const parentActivityId = currentLot.ActivityId
  currentLot.ActivityId = newActivityId

  const processActivity =
    new ProcessActivity({
      id: newActivityId, name: "Olah", parentIds: [parentActivityId], createdAt, lot: currentLot
    },
    supplier, storage, processTo, location
  )

  return {
    lot: currentLot,
    activity: processActivity
  }
}

export {
  getValidatedUserAndProcessRequest,
  getLotAndProcessActivity
}