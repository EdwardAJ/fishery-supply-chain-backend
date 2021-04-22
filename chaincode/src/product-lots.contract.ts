/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { getAllHistoryResults, readState } from "./utils/util"

// Contract to store product lots
export class ProductLotsContract extends Contract {

	public async createOrUpdateProductLot
		(context: Context, productLotId: string, productLotJson: string): Promise<void> {
    await context.stub.putState(productLotId, Buffer.from(productLotJson))
  }

  public async getProductLot (context: Context, productLotId: string): Promise<any> {
    const productLot = await readState(context, productLotId)
    return JSON.stringify(productLot)
  }

  public async getProductLotsByQuery(context: Context, queryString: string): Promise<any> {
    const resultsIterator = await context.stub.getQueryResult(queryString)
    const results = await getAllHistoryResults(resultsIterator)
    return results
  }
}
