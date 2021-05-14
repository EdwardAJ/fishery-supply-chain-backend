import { Context, Contract } from "fabric-contract-api"
import { FisheryProductLot } from "./models/base/fishery-product-lot.model"
import { User } from "./models/base/user.model"
import { readState } from "./utils/contract.util"

export class FisheryProductLotContract extends Contract {

	public async createOrUpdateLot
		(context: Context, lot: FisheryProductLot): Promise<void> {
    await context.stub.putState(lot.Id, Buffer.from(JSON.stringify(lot)))
  }

  public async getLot (context: Context, lotId: string): Promise<FisheryProductLot> {
    const { id, weight, commodityType, activityId, owner } = await readState(context, lotId)
    if (!weight || !commodityType) throw new Error("Lot does not exist!")
    return new FisheryProductLot({
      id, weight, commodityType,
      activityId,
      owner: new User(owner.username, owner.organization)
    })
  }
}
