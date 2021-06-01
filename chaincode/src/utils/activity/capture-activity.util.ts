import { Context } from "fabric-contract-api"
import { OrgNames } from "../../constants/organization.constant"
import { ActivityInterface } from "../../interfaces/base/activity.interface"
import { LotAndActivityInterface } from "../../interfaces/base/lot-and-activity.interface"
import { CaptureRequestInterface } from "../../interfaces/request/requests.interface"
import { Activity } from "../../models/base/activity.model"
import { FisheryProductLot } from "../../models/base/fishery-product-lot.model"
import { User } from "../../models/base/user.model"
import { CaptureActivity } from "../../models/capture/capture-activity.model"
import { validateAndGetUser } from "../user.util"

const getValidatedUserAndCaptureRequest = (context: Context, requestBody: string): {
  user: User, request: CaptureRequestInterface
} => {
  const user = validateAndGetUser(context, [OrgNames.ORG_1])
  const captureRequest = JSON.parse(requestBody) as CaptureRequestInterface
  return {
    request: captureRequest,
    user
  }
}

const getLotAndCaptureActivity =
  ({
    location, lot: { weight, commodityType },
    vessel, harbor, newLotId, newActivityId, createdAt
  }: CaptureRequestInterface, user: User): LotAndActivityInterface => {
  
  const newLot = new FisheryProductLot({
    id: newLotId, weight, commodityType, owner: new User(user.Username, user.Organization),
    activityId: newActivityId
  })
  
  const captureActivity = new CaptureActivity(
    { id: newActivityId, name: "Penangkapan", parentIds: null, lot: newLot, createdAt },
    harbor, vessel, location
  )

  return {
    lot: newLot,
    activity: captureActivity
  }
}

export {
  getValidatedUserAndCaptureRequest,
  getLotAndCaptureActivity
}