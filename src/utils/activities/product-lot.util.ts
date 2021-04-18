import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"
import { getGeneratedUuid } from "../uuid.util"
import { UserInterface } from "~/interfaces/user.interface"
import { ProductLotInterface } from "~/interfaces/product-lot.interface"
import { query } from "~/services/query.service"

const validateLotInformation = async (
  currentLotIds: string[], newLots: ProductLotInterface[]
): Promise<void> => {
  if (!currentLotIds?.length)
    throw new Error("Please provide current lot information")

  if (currentLotIds.length > 1) {
    if (!newLots?.length) {
      throw new Error("Please provide new lot information")
    }        
  }
}

// Multiple currentLotIds mean that the user wants to combine multiple lots to one lot.
// The activitiesChainId of every currentLotId inside currentLotIds must be the same.

const getCurrentLots = async (
  currentLotIds: string[], user: UserInterface
): Promise<FisheryProductLot[]> => {
  const currentLots: FisheryProductLot[] = []
  await Promise.all(currentLotIds.map(async (lotId: string) => {
    const productLot = await getProductLotFromBlockchain(user, lotId)
    currentLots.push(productLot)
  }))
  return currentLots
}

const getProductLotFromBlockchain =
  async (user: UserInterface, lotId: string): Promise<FisheryProductLot> => {
  const productLotBuffer = await query(user, "ProductLotsContract", "getProductLot", lotId)
  const productLotJson: ProductLotInterface = JSON.parse(productLotBuffer.toString())
  if (!productLotJson) throw new Error("Current lot id does not exist")
  return new FisheryProductLot(productLotJson)
}

const getParentActivityIds = (currentLots: FisheryProductLot[]): string[] => {
  const parentActivityIds: string[] = []
  currentLots.map(({ ActivityId }) => {
    parentActivityIds.push(ActivityId)
  })
  return parentActivityIds
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
  newLot: ProductLotInterface, activitiesChainId: string
): FisheryProductLot => {
  const { weight, commodityType } = newLot
  return new FisheryProductLot(
    { id: getGeneratedUuid(), weight, commodityType,
    activitiesChainId, activityId: getGeneratedUuid() })
}

export {
  validateLotInformation,
  getCurrentLots,
  getProductLotFromBlockchain,
  getParentActivityIds,
  getNewProductLot,
  getNewProductLots
}