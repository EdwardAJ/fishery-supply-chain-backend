import { Context } from "fabric-contract-api"
import { Shim } from "fabric-shim"
import { FisheryProductLotRequestInterface } from "../interfaces/request/fishery-product-lot-request.interface"
import { FisheryProductLot } from "../models/base/fishery-product-lot.model"
import { User } from "../models/base/user.model"
import { FisheryProductLotContract } from "../fishery-product-lot.contract"
import { getGeneratedUuid } from "./uuid.util"

const createOrUpdateLot = async (context: Context, currentLot: FisheryProductLot): Promise<void> => {
  const logger = Shim.newLogger("createOrUpdateFisheryProductLot")
  const fisheryProductLotContract = new FisheryProductLotContract()
  logger.debug("Saving fisheryProductLotContract: %O", fisheryProductLotContract)
  await fisheryProductLotContract.createOrUpdateLot(context, currentLot)
}

const getNewLot = (
  { weight, commodityType }: FisheryProductLotRequestInterface,
  lotId: string,
  activityId: string,
  owner: User
): FisheryProductLot => {
  return new FisheryProductLot(
    {
      id: lotId,
      weight,
      commodityType,
      owner,
      activityId
    }
  )
}

export {
  createOrUpdateLot,
  getNewLot
}
