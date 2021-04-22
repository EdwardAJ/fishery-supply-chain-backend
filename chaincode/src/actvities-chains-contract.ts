/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { getAllHistoryResults, readState } from "./utils/util"

// Contract to store multiple activities chain
export class ActivitiesChainsContract extends Contract {

	public async createOrUpdateActivitiesChain
		(context: Context, activitiesChainId: string, actvitiesChainJson: string): Promise<void> {
    await context.stub.putState(activitiesChainId, Buffer.from(actvitiesChainJson))
  }

  public async getActivitiesChainHistory (context: Context, activitiesChainId: string): Promise<any> {
    const resultsIterator = await context.stub.getHistoryForKey(activitiesChainId)
    const results = await getAllHistoryResults(resultsIterator)
    return JSON.stringify(results)
	}
	
	public async getCurrentActivitiesChain(context: Context, activitiesChainId: string): Promise<any> {
		const currentActivitiesChain = await readState(context, activitiesChainId)
    return JSON.stringify(currentActivitiesChain)
	}
}
