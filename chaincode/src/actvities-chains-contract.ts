/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { OrgNames } from "./constants/organization.constant"
import { CaptureRequestInterface } from "./interfaces/request/capture-request.interface"
import { ActivitiesChain } from "./models/base/activities-chain.model"
import { User } from "./models/base/user.model"
import { CaptureActivity } from "./models/capture/capture-activity.model"
import { createOrUpdateActivitiesChain } from "./utils/activity.util"
import { createOrUpdateFisheryProductLot, getNewFisheryProductLot } from "./utils/fishery-product-lot.util"
import { getAndValidateUser } from "./utils/user.util"
import { getAllHistoryResults, readState } from "./utils/util"
import { getGeneratedUuid } from "./utils/uuid.util"

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
  
  public async capture(context: Context, username: string, requestBody: CaptureRequestInterface) {
    const { location, fisheryProduct, vessel, harbor } = requestBody

    const user = await getAndValidateUser(context, username, OrgNames.ORG_1)
    const activitiesChainId = getGeneratedUuid()

    const newFisheryProductLot = getNewFisheryProductLot(
      fisheryProduct, activitiesChainId,
      new User(username, user.Organization, user.Role)
    )

    newFisheryProductLot.Harbor = harbor
    newFisheryProductLot.Vessel = vessel

    const captureActivity = new CaptureActivity(
      {
        id: newFisheryProductLot.ActivityId,
        name: "Penangkapan",
        parentIds: null,
        lot: newFisheryProductLot,
        createdAt: new Date().toISOString(),
      },
      harbor, vessel, location
    )

    const activitiesChain = new ActivitiesChain(activitiesChainId, [captureActivity])
    await createOrUpdateFisheryProductLot(context, newFisheryProductLot)
    await createOrUpdateActivitiesChain(context, activitiesChain)
  }
}
