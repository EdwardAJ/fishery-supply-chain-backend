import { Context } from "fabric-contract-api"
import { OrgNames } from "../../constants/organization.constant"
import { LotAndActivityInterface } from "../../interfaces/base/lot-and-activity.interface"
import { MarketRequestInterface } from "../../interfaces/request/requests.interface"
import { User } from "../../models/base/user.model"
import { MarketActivity } from "../../models/market/market-activity.model"
import { getLotAndEnsureOwnership } from "../fishery-product-lot.util"
import { validateAndGetUser } from "../user.util"

const getValidatedUserAndMarketRequest = (context: Context, requestBody: string): {
  user: User, request: MarketRequestInterface
} => {
  const user = validateAndGetUser(context, [OrgNames.ORG_3])
  const marketRequest = JSON.parse(requestBody) as MarketRequestInterface
  validateMarketRequest(marketRequest)
  return {
    request: marketRequest,
    user
  }
}

const validateMarketRequest = (marketRequest: MarketRequestInterface): void => {
  const {
    currentLot: { id: currentLotId },
    location: { latitude, longitude },
    marketTo: { id: marketToId, name: marketToName }
  } = marketRequest

  if (!currentLotId || !latitude || !longitude || !marketToId || !marketToName) {
    throw new Error("Please provide sufficient information")
  }
}

const getLotAndMarketActivity =
  async (context: Context, marketRequest: MarketRequestInterface, user: User):Promise<LotAndActivityInterface> => {
  
  const {
    currentLot: { id: currentLotId },
    location, marketTo, newActivityId, createdAt
  } = marketRequest

  const currentLot = await getLotAndEnsureOwnership(context, currentLotId, user)
  currentLot.Owner = null
  
  const parentActivityId = currentLot.ActivityId
  currentLot.ActivityId = newActivityId

  const marketActivity =
    new MarketActivity({
      id: newActivityId, name: "Pasarkan", parentIds: [parentActivityId], createdAt, lot: currentLot
    },
    marketTo, location
  )

  return {
    lot: currentLot,
    activity: marketActivity
  }
}

export {
  getValidatedUserAndMarketRequest,
  getLotAndMarketActivity
}