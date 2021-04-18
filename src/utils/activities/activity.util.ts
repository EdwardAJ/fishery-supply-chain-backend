import { query } from "~/services/query.service"
import { UserInterface } from "~/interfaces/user.interface"
import { ActivitiesChain } from "~/models/blockchain/base/activities-chain.model"
import { Activity } from "~/models/blockchain/base/activity.model"
import { invoke } from "~/services/invoke.service"
import { CustomError } from "~/models/error/custom-error.model"
import { Codes } from "~/constants/http/code.constant"
import { getProductLotFromBlockchain } from "./product-lot.util"
import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"

const updateActivitiesChain = async (
  activitiesChainId: string, activities: Activity[], user: UserInterface
): Promise<void> => {
  const activitiesChain = new ActivitiesChain(activitiesChainId, activities)
  await invoke(
    user, "ActivitiesChainsContract", "createActivitiesChain",
    activitiesChainId, JSON.stringify(activitiesChain)
  )
}

const getProductLotAndEnsureOwnership = async (
  currentLotId: string, user: UserInterface
): Promise<FisheryProductLot> => {
  const productLot =
    await getProductLotFromBlockchain(user, currentLotId)

  if (!productLot) {
    throw new Error("Product lot not found!")
  }
  const {
    ActivitiesChainId: activitiesChainId,
    ActivityId: activityId
  } = productLot

  if (!await isOwnerOfLot(activitiesChainId, activityId, user)) {
    throw new CustomError("Forbidden!", Codes.FORBIDDEN)
  }
  return productLot
}

const isOwnerOfLot = async (
  activitiesChainId: string, activityId: string, user: UserInterface
): Promise<boolean> => {
  const activitiesChain = await getActivitiesChain(activitiesChainId, user)
  return isOwnerOfActivity(activitiesChain, activityId, user)
}

const getActivitiesChain = 
  async (activitiesChainId: string, user: UserInterface):
    Promise<ActivitiesChain> => {
  const activitiesChainBuffer =
    await query(user, "ActivitiesChainsContract", "getActivitiesChain", activitiesChainId)
  return JSON.parse(activitiesChainBuffer.toString())
}

const isOwnerOfActivity = (
  activitiesChain: ActivitiesChain, activityId: string, user: UserInterface
): boolean => {
  for (const activity of activitiesChain.Activities) {
    const {Id, Owner: { OrganizationName }} = activity
    if (Id === activityId && OrganizationName === user.organization) {
        return true
    }
  }
  return false
}

export {
  updateActivitiesChain,
  getProductLotAndEnsureOwnership
}