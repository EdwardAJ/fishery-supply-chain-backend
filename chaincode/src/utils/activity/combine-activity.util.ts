import { Context } from "fabric-contract-api"
import { OrgNames } from "../../constants/organization.constant"
import { LotAndActivityInterface } from "../../interfaces/base/lot-and-activity.interface"
import { CombineRequestInterface } from "../../interfaces/request/requests.interface"
import { FisheryProductLot } from "../../models/base/fishery-product-lot.model"
import { User } from "../../models/base/user.model"
import { CombineActivity } from "../../models/combine/combine-activity.model"
import { getLotAndEnsureOwnership } from "../fishery-product-lot.util"
import { validateAndGetUser } from "../user.util"

const getValidatedUserAndCombineRequest = (context: Context, requestBody: string): {
  user: User, request: CombineRequestInterface
} => {
  const user = validateAndGetUser(context, [OrgNames.ORG_1, OrgNames.ORG_2, OrgNames.ORG_3])
  const combineRequest = JSON.parse(requestBody) as CombineRequestInterface
  validateCombineRequest(combineRequest)
  return {
    request: combineRequest,
    user
  }
}

const validateCombineRequest = (combineRequest: CombineRequestInterface): void => {
  const { currentLot, newLot: { weight, commodityType } } = combineRequest
  if (!currentLot.ids.length || !weight || !commodityType) {
    throw new Error("Please provide lot information")
  }
}

const getParentActivityIds =
  async (context: Context, currentLotIds: string[], user: User): Promise<string[]> => {
  const parentActivityIds: string[] = []
  for (const lotId of currentLotIds) {
    const { ActivityId } = await getLotAndEnsureOwnership(context, lotId, user)
    parentActivityIds.push(ActivityId)
  }
  return parentActivityIds

}
const getLotAndCombineActivity =
  async (context: Context, {
    currentLot, newLot: { weight, commodityType },
    newLotId, newActivityId, createdAt
  }: CombineRequestInterface, user: User):Promise<LotAndActivityInterface> => {
  
  const parentActivityIds = await getParentActivityIds(context, currentLot.ids, user)
  const newLot = new FisheryProductLot({
    id: newLotId, weight, commodityType,
    owner: new User(user.Username, user.Organization),
    activityId: newActivityId
  })
  const combineActivity = new CombineActivity({
    id: newActivityId, name: "Gabung", parentIds: parentActivityIds, createdAt, lot: newLot
  })

  return {
    lot: newLot,
    activity: combineActivity
  }
}

export {
  getValidatedUserAndCombineRequest,
  getLotAndCombineActivity
}