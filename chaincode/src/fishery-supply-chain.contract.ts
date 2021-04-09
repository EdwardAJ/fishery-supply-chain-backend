import { Context, Contract } from "fabric-contract-api"

export class FisherySupplyChainContract extends Contract {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async initLedger(context: Context): Promise<void> {
    console.log("Ledger is being initialized")
  }

  public async createActivity(context: Context, activityId: string, activityJson: string): Promise<void> {
    context.stub.putState(activityId, Buffer.from(activityJson))
  }

  // TODO: change getActivityById to getActivitiesByFisheryProductLotId
  // this is just a sample
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getActivityById(context: Context, activityId: string): Promise<any> {
    const activity = await context.stub.getState(activityId)
    return activity.toString()
  }
}
