/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"

// Contract to store product lots
export class ProductLotsContract extends Contract {

	public async createProductLot
		(context: Context, productLotId: string, productLotJson: string): Promise<void> {
    context.stub.putState(productLotId, Buffer.from(productLotJson))
  }

  public async getProductLot (context: Context, productLotId: string): Promise<any> {
    const productLot = await this.readState(context, productLotId)
    return JSON.stringify(productLot)
  }

  // Taken from asset-transfer-events
  public async readState (context: Context, productLotId: string) {
    const productLotBuffer = await context.stub.getState(productLotId) // get the asset from chaincode state
    if (!productLotBuffer || productLotBuffer.length === 0) {
      throw new Error(`The lot ${productLotId} does not exist`)
    }
    return JSON.parse(productLotBuffer.toString())
  }
}
