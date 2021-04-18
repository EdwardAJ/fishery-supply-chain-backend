/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"

// Contract to store multiple activities chain
export class ActivitiesChainsContract extends Contract {

	public async createActivitiesChain
		(context: Context, activitiesChainId: string, actvitiesChainJson: string): Promise<void> {
    context.stub.putState(activitiesChainId, Buffer.from(actvitiesChainJson))
  }

  public async getActivitiesChainHistory (context: Context, activitiesChainId: string): Promise<any> {
    const resultsIterator = await context.stub.getHistoryForKey(activitiesChainId)
    const results = await this.getAllResults(resultsIterator, true)
    return JSON.stringify(results)
	}
	
	public async getCurrentActivitiesChain(context: Context, activitiesChainId: string): Promise<any> {
		const currentActivitiesChain = await this.readState(context, activitiesChainId)
    return JSON.stringify(currentActivitiesChain)
	}

  // Taken from asset-transfer-ledger-queries
  public async getAllResults(iterator: any, isHistory: boolean): Promise<any> {
		const allResults = []
		let res = await iterator.next()
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				const jsonRes = {}
				console.log(res.value.value.toString("utf8"))
				if (isHistory && isHistory === true) {
					jsonRes["TxId"] = res.value.tx_id
					jsonRes["Timestamp"] = res.value.timestamp
					try {
						jsonRes["Value"] = JSON.parse(res.value.value.toString("utf8"))
					} catch (err) {
						console.log(err)
						jsonRes["Value"] = res.value.value.toString("utf8")
					}
				} else {
					jsonRes["Key"] = res.value.key
					try {
						jsonRes["Record"] = JSON.parse(res.value.value.toString("utf8"))
					} catch (err) {
						console.log(err)
						jsonRes["Record"] = res.value.value.toString("utf8")
					}
        }
        console.log("result json: ", jsonRes)
				allResults.push(jsonRes)
			}
			res = await iterator.next()
		}
		iterator.close()
		return allResults
	}

	// Taken from asset-transfer-events
  public async readState (context: Context, activitesChainId: string) {
    const activitiesChainBuffer = await context.stub.getState(activitesChainId) // get the asset from chaincode state
    if (!activitiesChainBuffer || activitiesChainBuffer.length === 0) {
      throw new Error(`The activities chain ${activitesChainId} does not exist`)
    }
    return JSON.parse(activitiesChainBuffer.toString())
  }
}
