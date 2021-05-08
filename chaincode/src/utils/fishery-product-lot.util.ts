import { Context } from "fabric-contract-api"
import { Shim } from "fabric-shim"
import { FisheryProductLot } from "../models/base/fishery-product-lot.model"
import { User } from "../models/base/user.model"
import { FisheryProductLotContract } from "../fishery-product-lot.contract"

const createOrUpdateLot = async (context: Context, currentLot: FisheryProductLot): Promise<void> => {
  const logger = Shim.newLogger("createOrUpdateFisheryProductLot")
  const fisheryProductLotContract = new FisheryProductLotContract()
  logger.debug("Saving fisheryProductLotContract: %O", fisheryProductLotContract)
  await fisheryProductLotContract.createOrUpdateLot(context, currentLot)
}

const getLot = async (context: Context, id: string): Promise<FisheryProductLot> => {
  const fisheryProductLotContract = new FisheryProductLotContract()
  const lot = await fisheryProductLotContract.getLot(context, id)
  return lot
}

const getLotAndEnsureOwnership = async (context: Context, id: string, user: User): Promise<FisheryProductLot> => {
  const lot = await getLot(context, id)
  const { Owner: { Organization, Username }} = lot
  if (Organization !== user.Organization || Username !== user.Username) {
    throw new Error("Forbidden!")
  }
  return lot
}

export {
  createOrUpdateLot,
  getLot,
  getLotAndEnsureOwnership
}
