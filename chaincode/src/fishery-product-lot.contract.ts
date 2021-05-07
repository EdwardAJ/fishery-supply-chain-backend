import { Context, Contract } from "fabric-contract-api"
import { FisheryProductLot } from "./models/base/fishery-product-lot.model"
import { readState } from "./utils/contract.util"

export class FisheryProductLotContract extends Contract {

	public async createOrUpdateLot
		(context: Context, lot: FisheryProductLot): Promise<void> {
    await context.stub.putState(lot.Id, Buffer.from(JSON.stringify(lot)))
  }

  public async getLot (context: Context, lotId: string): Promise<string> {
    const lot = await readState(context, lotId)
    return JSON.stringify(lot)
  }
}
