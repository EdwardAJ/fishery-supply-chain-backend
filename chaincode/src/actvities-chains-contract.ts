/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { Shim } from "fabric-shim"
import { OrgNames } from "./constants/organization.constant"
import { CaptureRequestInterface } from "./interfaces/request/capture-request.interface"
import { ActivitiesChain } from "./models/base/activities-chain.model"
import { User } from "./models/base/user.model"
import { CaptureActivity } from "./models/capture/capture-activity.model"
import { createOrUpdateFisheryProductLot, getNewFisheryProductLot } from "./utils/fishery-product-lot.util"
import { isAuthorizedAndGetUser } from "./utils/user.util"
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
  
  public async capture(context: Context, requestBody: string) {

    const logger = Shim.newLogger("capture")
    logger.info(`Capture with requestBody: ${requestBody}`)
  
    const {
      location,
      fisheryProduct,
      vessel,
      harbor 
    } = JSON.parse(requestBody) as CaptureRequestInterface

    logger.info(`location: ${location}`)
    logger.info(`fisheryProduct: ${fisheryProduct}`)
    logger.info(`vessel: ${vessel}`)
    logger.info(`harbor: ${harbor}`)

    const user = isAuthorizedAndGetUser(context, OrgNames.ORG_1)
    const activitiesChainId = getGeneratedUuid()

    const newFisheryProductLot = getNewFisheryProductLot(
      fisheryProduct, activitiesChainId,
      new User(user.Username, user.Organization, user.Role)
    )

    logger.info(`harbor: ${harbor}`)

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

    logger.info(`Creating captureActivity: ${captureActivity}`)
    

    const activitiesChain = new ActivitiesChain(activitiesChainId, [captureActivity])
    logger.info(`Creating activitiesChain: ${activitiesChain}`)
    await createOrUpdateFisheryProductLot(context, newFisheryProductLot)
    await this.createOrUpdateActivitiesChain(context, activitiesChainId, JSON.stringify(activitiesChain))

    return JSON.stringify(captureActivity)
  }
}
