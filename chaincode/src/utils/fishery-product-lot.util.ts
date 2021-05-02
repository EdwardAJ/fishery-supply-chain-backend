import { Context } from "fabric-contract-api"
import { FisheryProductLotRequestInterface } from "../interfaces/request/fishery-product-lot-request.interface"
import { FisheryProductLot } from "../models/base/fishery-product-lot.model"
import { User } from "../models/base/user.model"
import { ProductLotsContract } from "../product-lots.contract"
import { getGeneratedUuid } from "./uuid.util"

const createOrUpdateFisheryProductLot = async (
  context: Context,
  currentProductLot: FisheryProductLot
): Promise<void> => {
  const fisheryProductLotsContract = new ProductLotsContract()
  await fisheryProductLotsContract.createOrUpdateProductLot(context, currentProductLot.Id, JSON.stringify(currentProductLot))
}

const getNewFisheryProductLot = (
  { weight, commodityType }: FisheryProductLotRequestInterface,
  activitiesChainId: string,
  owner: User
): FisheryProductLot => {
  return new FisheryProductLot(
    {
      id: getGeneratedUuid(),
      weight,
      commodityType,
      owner,
      activitiesChainId,
      activityId: getGeneratedUuid()
    })
}

export {
  createOrUpdateFisheryProductLot,
  getNewFisheryProductLot
}
