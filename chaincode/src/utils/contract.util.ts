/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context } from "fabric-contract-api"

// Taken from asset-transfer-ledger-queries
async function getTotalWeight(iterator: any): Promise<any> {
  let totalWeight = 0
  let res = await iterator.next()
  while (!res.done) {
    if (res.value && res.value.value.toString()) {
      let jsonRes: any = {}
      try {
        jsonRes = JSON.parse(res.value.value.toString("utf8"))
      } catch (err) {
        console.log(err)
        jsonRes = res.value.value.toString("utf8")
      }
      // console.log("Res: ", jsonRes)
      totalWeight += jsonRes.lot.weight
    }
    res = await iterator.next()
  }
  iterator.close()
  return totalWeight
}

// Taken from asset-transfer-events
async function readState (context: Context, key: string): Promise<any> {
  const buffer = await context.stub.getState(key) // get the asset from chaincode state
  if (!buffer || buffer.length === 0) {
    throw new Error(`The ${key} does not exist`)
  }
  return JSON.parse(buffer.toString())
}

export {
  getTotalWeight, readState
}