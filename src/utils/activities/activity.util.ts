import { query } from "~/services/query.service"
import { UserInterface } from "~/interfaces/user.interface"
import { ActivitiesChain } from "~/models/blockchain/base/activities-chain.model"
import { Activity } from "~/models/blockchain/base/activity.model"
import { invoke } from "~/services/invoke.service"

const createOrUpdateActivitiesChain = async (
  activitiesChainId: string, activities: Activity[], user: UserInterface): Promise<void> => {
  const activitiesChain = new ActivitiesChain(activitiesChainId, activities)
  await invoke(
    user, "ActivitiesChainsContract", "createOrUpdateActivitiesChain",
    activitiesChainId, JSON.stringify(activitiesChain)
  )
}

const getActivitiesChain = 
  async (activitiesChainId: string, user: UserInterface): Promise<ActivitiesChain> => {
  const activitiesChainBuffer =
    await query(user, "ActivitiesChainsContract", "getCurrentActivitiesChain", activitiesChainId)
  return JSON.parse(activitiesChainBuffer.toString())
}

const isOwnerOfActivity = (
  activitiesChain: ActivitiesChain, activityId: string, user: UserInterface): boolean => {
  for (const activity of activitiesChain.Activities) {
    const {Id, Owner: { OrganizationName }} = activity
    if (Id === activityId && OrganizationName === user.organization) {
        return true
    }
  }
  return false
}

export {
  createOrUpdateActivitiesChain,
  getActivitiesChain,
  isOwnerOfActivity
}