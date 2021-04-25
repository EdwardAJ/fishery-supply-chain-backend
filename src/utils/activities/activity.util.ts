import { query } from "~/services/query.service"
import { UserInterface } from "~/interfaces/user.interface"
import { ActivitiesChain } from "~/models/blockchain/base/activities-chain.model"
import { Activity } from "~/models/blockchain/base/activity.model"
import { invoke } from "~/services/invoke.service"
import { ActivitesChainFromBlockchainInterface } from "~/interfaces/blockchain/activities-chain.interface"

const createOrUpdateActivitiesChain = async (
  activitiesChainId: string, activities: Activity[], user: UserInterface): Promise<void> => {
  const activitiesChain = new ActivitiesChain(activitiesChainId, activities)
  await invoke(
    user, "ActivitiesChainsContract", "createOrUpdateActivitiesChain",
    activitiesChainId, JSON.stringify(activitiesChain)
  )
}

const getActivitiesChain = async (activitiesChainId: string, user: UserInterface):
Promise<ActivitesChainFromBlockchainInterface> => {
  const activitiesChainBuffer =
    await query(user, "ActivitiesChainsContract", "getCurrentActivitiesChain", activitiesChainId)
  return JSON.parse(activitiesChainBuffer.toString())
}


export {
  createOrUpdateActivitiesChain,
  getActivitiesChain
}