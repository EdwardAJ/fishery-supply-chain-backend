/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"

export class FisherySupplyChainContract extends Contract {

  public async createActivity(context: Context, activityId: string, activityJson: string): Promise<void> {
    context.stub.putState(activityId, Buffer.from(activityJson))
  }

  public async getActivities (context: Context, queryString: string): Promise<any> {
    const resultsIterator = await context.stub.getQueryResult(queryString)
    const results = await this.GetAllResults(resultsIterator, false)
    return JSON.stringify(results)
  }

  // Taken from asset-transfer-ledger-queries
  public async GetAllResults(iterator: any, isHistory: boolean): Promise<any> {
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

  // TODO: change getActivityById to getActivitiesByFisheryProductLotId
  // this is just a sample
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getActivityById(context: Context, activityId: string): Promise<any> {
    const activity = await context.stub.getState(activityId)
    return activity.toString()
  }
}
