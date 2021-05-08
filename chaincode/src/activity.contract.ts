/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context, Contract } from "fabric-contract-api"
import { SplitRequestInterface } from "./interfaces/request/requests.interface"

import { Activity } from "./models/base/activity.model"
import { User } from "./models/base/user.model"
import { FisheryProductLot } from "./models/base/fishery-product-lot.model"
import { SplitActivity } from "./models/split/split-activity.model"

import { createOrUpdateLot, getLot, getLotAndEnsureOwnership } from "./utils/fishery-product-lot.util"
import { getAllResults, readState } from "./utils/contract.util"

import { getLotAndCaptureActivity, getValidatedUserAndCaptureRequest } from "./utils/activity/capture-activity.util"
import { getLotAndCombineActivity, getValidatedUserAndCombineRequest } from "./utils/activity/combine-activity.util"
import { getValidatedUserAndSplitRequest } from "./utils/activity/split-activity.util"
import { getLotAndTransferActivity, getValidatedUserAndTransferRequest } from "./utils/activity/transfer-activity.util"


export class ActivityContract extends Contract {

	private async createActivity (context: Context, activity: Activity): Promise<void> {
    await context.stub.putState(activity.Id, Buffer.from(JSON.stringify(activity)))
  }

  private async createOrUpdateLotAndCreateActivity 
    (context: Context, lot: FisheryProductLot, activity: Activity): Promise<void> {
    await createOrUpdateLot(context, lot)
    await this.createActivity(context, activity)
  }

  private async createLotsAndSplitActivities
    (
      context: Context, { newLots, newLotIds, newActivityIds, createdAt }: SplitRequestInterface,
      parentActivityId: string, user: User
    ): Promise<SplitActivity[]> {

    const splitActivities = []
    for (let lotIndex = 0; lotIndex < newLots.length; lotIndex++) {
      const { weight, commodityType } = newLots[lotIndex]
      const newLotId = newLotIds[lotIndex]
      const newActivityId = newActivityIds[lotIndex]

      const newLot = new FisheryProductLot({
        id: newLotId, weight, commodityType, owner: user, activityId: newActivityId
      })

      const splitActivity = new SplitActivity({
        id: newActivityId, name: "Pecah", parentIds: [parentActivityId], createdAt, lot: newLot
      })

      splitActivities.push(splitActivity)
      await this.createOrUpdateLotAndCreateActivity(context, newLot, splitActivity)
    }
    return splitActivities
  }

  private async constructAndGetChain (context: Context, activityId: string): Promise<Activity[]> {
    const initialActivity = await this.getActivity(context, activityId)
    const activityQueue: Activity[] = [initialActivity]
    const activityChain: Activity[] = []

    while (activityQueue.length) {
      const length = activityQueue.length
      const parentActivityIds = new Set<string>()

      for (let i = 0; i < length; i++) {
        const activity = activityQueue.shift()
        activityChain.unshift(activity)
        
        if (activity?.ParentIds) {
          for (const parentId of activity?.ParentIds) {
            parentActivityIds.add(parentId)
          }
        }
      }

      for (const parentActivityId of parentActivityIds) {
        const parentActivity = await this.getActivity(context, parentActivityId)
        if (parentActivity) activityQueue.unshift(parentActivity)
      }
    }

    return activityChain
  }

  private async getActivity (context: Context, activityId: string): Promise<Activity> {
    const { id, name, parentIds, lot, createdAt } = await readState(context, activityId)
    return new Activity({ id, name, parentIds, lot, createdAt })
  }

  public async getActivitiesByQuery(context: Context, queryString: string): Promise<any> {
    const resultsIterator = await context.stub.getQueryResult(queryString)
    const results = await getAllResults(resultsIterator)
    return results
  }
	
  public async capture (context: Context, requestBody: string): Promise<string> {
    const { request, user } = getValidatedUserAndCaptureRequest(context, requestBody)
    const { lot, activity } = getLotAndCaptureActivity(request, user)
    await this.createOrUpdateLotAndCreateActivity(context, lot, activity)
    return JSON.stringify(activity)
  }

  public async combine (context: Context, requestBody: string): Promise<string> {
    const { request, user } = getValidatedUserAndCombineRequest(context, requestBody)
    const { lot, activity } = await getLotAndCombineActivity(context, request, user)
    await this.createOrUpdateLotAndCreateActivity(context, lot, activity)
    return JSON.stringify(activity)
  }

  public async split (context: Context, requestBody: string): Promise<string> {
    const { request, user } = getValidatedUserAndSplitRequest(context, requestBody)
    const { ActivityId: parentActivityId } = await getLotAndEnsureOwnership(context, request.currentLot.id, user)
    const splitActivities = await this.createLotsAndSplitActivities(context, request, parentActivityId, user)
    return JSON.stringify(splitActivities)
  }

  public async transfer (context: Context, requestBody: string): Promise<string> {
    const { request, user } = getValidatedUserAndTransferRequest(context, requestBody)
    const { lot, activity } = await getLotAndTransferActivity(context, request, user)
    await this.createOrUpdateLotAndCreateActivity(context, lot, activity)
    return JSON.stringify(activity)
  }

  public async getActivityChain (context: Context, lotId: string): Promise<string> {
    if (!lotId) throw new Error("Please provide lotId")
    const { ActivityId } = await getLot(context, lotId)
    const activityChain = await this.constructAndGetChain(context, ActivityId)
    return JSON.stringify(activityChain)
  }
}