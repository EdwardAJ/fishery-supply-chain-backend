/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context } from "fabric-contract-api"

// Taken from asset-transfer-ledger-queries
async function getAllHistoryResults(iterator: any): Promise<any> {
  const allResults = []
  let res = await iterator.next()
  while (!res.done) {
    if (res.value && res.value.value.toString()) {
      let jsonRes = {}
      console.log(res.value.value.toString("utf8"))
      try {
        jsonRes = JSON.parse(res.value.value.toString("utf8"))
      } catch (err) {
        console.log(err)
        jsonRes = res.value.value.toString("utf8")
      }
      allResults.push(jsonRes)
    }
    res = await iterator.next()
  }
  iterator.close()
  return allResults
}

// Taken from asset-transfer-events
async function readState (context: Context, productLotId: string): Promise<any> {
  const productLotBuffer = await context.stub.getState(productLotId) // get the asset from chaincode state
  if (!productLotBuffer || productLotBuffer.length === 0) {
    throw new Error(`The lot ${productLotId} does not exist`)
  }
  return JSON.parse(productLotBuffer.toString())
}

export {
  getAllHistoryResults, readState
}