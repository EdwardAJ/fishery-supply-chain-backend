/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { Shim } from "fabric-shim"
import { OrgNames } from "./constants/organization.constant"
import { CaptureRequestInterface } from "./interfaces/request/capture-request.interface"
import { Activity } from "./models/base/activity.model"
import { User } from "./models/base/user.model"
import { CaptureActivity } from "./models/capture/capture-activity.model"
import { createOrUpdateLot, getNewLot } from "./utils/fishery-product-lot.util"
import { isAuthorizedAndGetUser } from "./utils/user.util"
import { getAllResults, readState } from "./utils/contract.util"

export class ActivityContract extends Contract {

	public async createActivity (context: Context, activity: Activity): Promise<void> {
    await context.stub.putState(activity.Id, Buffer.from(JSON.stringify(activity)))
  }

  public async getActivity (context: Context, activityId: string): Promise<string> {
    const activity = await readState(context, activityId)
    return JSON.stringify(activity)
  }

  public async getActivitiesByQuery(context: Context, queryString: string): Promise<any> {
    const resultsIterator = await context.stub.getQueryResult(queryString)
    const results = await getAllResults(resultsIterator)
    return results
  }
	
  public async capture(context: Context, requestBody: string) { 
    const { location, fisheryProduct, vessel, harbor, createdAt, newLotId, captureActivityId } = 
      JSON.parse(requestBody) as CaptureRequestInterface

    const user = isAuthorizedAndGetUser(context, OrgNames.ORG_1)
    const newLot = getNewLot(
      fisheryProduct, newLotId, captureActivityId,
      new User(user.Username, user.Organization, user.Role)
    )
    
    const captureActivity = new CaptureActivity(
      {
        id: newLot.ActivityId,
        name: "Penangkapan",
        parentIds: null,
        lot: newLot,
        createdAt
      },
      harbor, vessel, location
    )
    
    await createOrUpdateLot(context, newLot)
    await this.createActivity(context, captureActivity)
    return JSON.stringify(captureActivity)
  }
}
