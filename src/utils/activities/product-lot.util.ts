import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"
import { Codes } from "~/constants/http/code.constant"

import { CustomError } from "~/models/error/custom-error.model"

import { UserInterface } from "~/interfaces/user.interface"
import { ProductLotInterface, ProductLotRequestBodyInterface } from "~/interfaces/product-lot.interface"

import { query } from "~/services/query.service"

import { getGeneratedUuid } from "../uuid.util"
import { invoke } from "~/services/invoke.service"
import { User } from "~/models/blockchain/base/user.model"
import { ProductLotFromBlockchainInterface } from "~/interfaces/blockchain/product-lot.interface"

const getProductLotFromBlockchain =
  async (user: UserInterface, lotId: string): Promise<FisheryProductLot> => {
  const productLotBuffer = await query(user, "ProductLotsContract", "getProductLot", lotId)
  const productLotJson: ProductLotFromBlockchainInterface = JSON.parse(productLotBuffer.toString())
  if (!productLotJson) throw new Error("Current lot id does not exist")
  const { id, weight, commodityType, activitiesChainId, activityId, owner } = productLotJson
  return new FisheryProductLot({
    id, weight, commodityType,
    activitiesChainId,
    activityId,
    owner: new User(owner.username, owner.organizationName)
  })
}

const getNewProductLots = (
  newLots: ProductLotInterface[], activitiesChainId: string, owner: User
): FisheryProductLot[] => {

  const newProductLots: FisheryProductLot[] = []
  newLots.map((newLot) => {
    newProductLots.push(getNewProductLot(newLot, activitiesChainId, owner))
  })

  return newProductLots
}

const getNewProductLot = (
  newLot: ProductLotRequestBodyInterface, activitiesChainId: string, owner: User
): FisheryProductLot => {
  const { weight, commodityType } = newLot
  return new FisheryProductLot(
    { id: getGeneratedUuid(), weight, commodityType, owner,
    activitiesChainId, activityId: getGeneratedUuid() })
}

const getProductLotAndEnsureOwnership = async (
  currentLotId: string, user: UserInterface
): Promise<FisheryProductLot> => {
  const productLot = await getProductLotFromBlockchain(user, currentLotId)
  if (
    productLot.Owner.OrganizationName !== user.organization ||
    productLot.Owner.Username !== user.username
  ) {
    throw new CustomError("Forbidden!", Codes.FORBIDDEN)
  }
  return productLot
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
  getNewProductLot,
  getNewProductLots,
  createOrUpdateProductLot
}