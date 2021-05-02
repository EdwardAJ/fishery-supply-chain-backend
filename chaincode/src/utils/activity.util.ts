
import { Context } from "fabric-contract-api"
import { ActivitiesChainsContract } from "../actvities-chains-contract"
import { ActivitiesChain } from "../models/base/activities-chain.model"

const createOrUpdateActivitiesChain = async (
  context: Context,
  activitiesChain: ActivitiesChain
): Promise<void> => {
  const activitiesChainsContract = new ActivitiesChainsContract()
  await activitiesChainsContract.createOrUpdateActivitiesChain(context, activitiesChain.Id, JSON.stringify(activitiesChain))
}

export {
  createOrUpdateActivitiesChain
}