import { UserInterface } from "~/interfaces/user.interface"
import { ActivitiesChain } from "~/models/blockchain/base/activities-chain.model"
import { Activity } from "~/models/blockchain/base/activity.model"
import { invoke } from "~/services/invoke.service"
import { 
  ActivitesChainFromBlockchainInterface, ActivityFromBlockchainInterface }
from "~/interfaces/blockchain/activities-chain.interface"

const createOrUpdateActivitiesChain = async (
  activitiesChainId: string, activities: Activity[], user: UserInterface): Promise<void> => {
  const activitiesChain = new ActivitiesChain(activitiesChainId, activities)
  await invoke(
    user, "ActivitiesChainsContract", "createOrUpdateActivitiesChain",
    activitiesChainId, JSON.stringify(activitiesChain)
  )
}

// Breadth first search for getting activities by tracing the parentId 
const getActivityChain = (
  completeActivitiesChain: ActivitesChainFromBlockchainInterface,
  activityId: string
): ActivityFromBlockchainInterface[] => {

  const initialActivity = getActivity(completeActivitiesChain, activityId)
  if (initialActivity === null) return []

  const activityQueue: ActivityFromBlockchainInterface[] = [initialActivity]
  const activityChain: ActivityFromBlockchainInterface[] = []

  while (activityQueue.length > 0) {
    const activity = activityQueue.shift()
    activityChain.unshift(activity as ActivityFromBlockchainInterface)
    if (activity?.parentIds) {
      for (const parentId of activity?.parentIds) {
        const parentActivity = getActivity(completeActivitiesChain, parentId)
        if (parentActivity) activityQueue.push(parentActivity)
      }
    }
  }
  return activityChain
}

const getActivity = (
  completeActivitiesChain: ActivitesChainFromBlockchainInterface,
  activityId: string
): ActivityFromBlockchainInterface | null => {
  for (const activity of completeActivitiesChain.activities) {
    if (activityId === activity.id) {
      return activity
    }
  }
  return null
}


export {
  createOrUpdateActivitiesChain,
  getActivityChain
}