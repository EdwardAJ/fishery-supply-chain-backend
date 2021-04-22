import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"
import { Codes } from "~/constants/http/code.constant"

import { CustomError } from "~/models/error/custom-error.model"

import { UserInterface } from "~/interfaces/user.interface"
import { ProductLotInterface, ProductLotRequestBodyInterface } from "~/interfaces/product-lot.interface"

import { query } from "~/services/query.service"

import { getGeneratedUuid } from "../uuid.util"
import { getActivitiesChain, isOwnerOfActivity } from "./activity.util"
import { invoke } from "~/services/invoke.service"

const getProductLotFromBlockchain =
  async (user: UserInterface, lotId: string): Promise<FisheryProductLot> => {
  const productLotBuffer = await query(user, "ProductLotsContract", "getProductLot", lotId)
  const productLotJson: ProductLotInterface = JSON.parse(productLotBuffer.toString())
  if (!productLotJson) throw new Error("Current lot id does not exist")
  return new FisheryProductLot(productLotJson)
}

const getNewProductLots = (
  newLots: ProductLotInterface[], activitiesChainId: string
): FisheryProductLot[] => {

  const newProductLots: FisheryProductLot[] = []
  newLots.map((newLot) => {
    newProductLots.push(getNewProductLot(newLot, activitiesChainId))
  })

  return newProductLots
}

const getNewProductLot = (
  newLot: ProductLotRequestBodyInterface, activitiesChainId: string
): FisheryProductLot => {
  const { weight, commodityType } = newLot
  return new FisheryProductLot(
    { id: getGeneratedUuid(), weight, commodityType,
    activitiesChainId, activityId: getGeneratedUuid() })
}

const getProductLotAndEnsureOwnership = async (
  currentLotId: string, user: UserInterface
): Promise<FisheryProductLot> => {
  const productLot = await getProductLotFromBlockchain(user, currentLotId)
  const { ActivitiesChainId: activitiesChainId, ActivityId: activityId } = productLot
  if (!await isOwnerOfLot(activitiesChainId, activityId, user)) {
    throw new CustomError("Forbidden!", Codes.FORBIDDEN)
  }
  return productLot
}

const isOwnerOfLot = async (
  activitiesChainId: string, activityId: string, user: UserInterface
): Promise<boolean> => {
  const activitiesChain = await getActivitiesChain(activitiesChainId, user)
  return isOwnerOfActivity(activitiesChain, activityId, user)
}

const createOrUpdateProductLot = async (
  currentProductLot: FisheryProductLot, user: UserInterface): Promise<void> => {
  await invoke(user, "ProductLotsContract", "createOrUpdateProductLot",
    currentProductLot.Id, JSON.stringify(currentProductLot)
  )
}


export {
  getProductLotFromBlockchain,
  getProductLotAndEnsureOwnership,
  isOwnerOfLot,
  getNewProductLot,
  getNewProductLots,
  createOrUpdateProductLot
}