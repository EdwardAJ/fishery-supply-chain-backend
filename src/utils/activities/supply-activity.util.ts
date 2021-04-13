 import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"
import { SupplyActivity } from "~/models/blockchain/supply/supply-activity.model"
import { Request } from "express"
import { Supplier } from "~/models/blockchain/supply/supplier.model"
import { Storage } from "~/models/blockchain/supply/storage.model"
import { User } from "~/models/blockchain/base/user.model"
import { GPSLocation } from "~/models/blockchain/base/gps-location.model"
import { invoke } from "~/services/invoke.service"
import { ActivitiesChain } from "~/models/blockchain/base/activities-chain.model"
import { UserInterface } from "~/interfaces/user.interface"
import { getNewProductLots } from "./product-lot.util"

const getSupplyActivity = 
  (req: Request, supplyActivityId: string, parentActivityIds: string[],
    productLot: FisheryProductLot, user: UserInterface
  ): SupplyActivity => {

  const {
    location: { latitude, longitude },
    supplier: { id: supplierId, name: supplierName },
    storage: { id: storageId, name: storageName },
  } = req.body

  return new SupplyActivity(
    {
      id: supplyActivityId,
      parentIds: parentActivityIds,
      currentLot: productLot,
      location: new GPSLocation(latitude, longitude),
      owner: new User(user.username, user.organization),
      createdAt: new Date().toISOString(),
    },
    new Supplier(supplierId, supplierName),
    new Storage(storageId, storageName)
  )
}

const splitLotsAndGetActivities = async (
  req: Request, activitiesChainId: string, supplyActivityId: string,
  parentActivityIds: string[], user: UserInterface
): Promise<SupplyActivity[]> => {

  const { new_lots: newLots } = req.body
  const supplyActivities: SupplyActivity[] = []
  const newProductLots: FisheryProductLot[] =
    getNewProductLots(newLots, activitiesChainId, supplyActivityId)

  await Promise.all(newProductLots.map(async (productLot: FisheryProductLot) => {
    await invoke(user, "ProductLotsContract", "createProductLot",
      productLot.Id, JSON.stringify(productLot))

    supplyActivities.push(
      getSupplyActivity(req, supplyActivityId, parentActivityIds, productLot, user)
    )
  }))

  return supplyActivities
}

const updateLotAndGetActivities = async (
  req: Request, currentLot: FisheryProductLot, supplyActivityId: string,
  parentActivityIds: string[], user: UserInterface
): Promise<SupplyActivity[]> => {

  const supplyActivities: SupplyActivity[] = []
  await invoke(user, "ProductLotsContract", "createProductLot",
    currentLot.Id, JSON.stringify(currentLot))
  
  supplyActivities.push(
    getSupplyActivity(req, supplyActivityId, parentActivityIds, currentLot, user)
  )

  return supplyActivities
}

const updateActivitiesChain = async (
  activitiesChainId: string, supplyActivities: SupplyActivity[], user: UserInterface
): Promise<void> => {
  const activitiesChain = new ActivitiesChain(activitiesChainId, supplyActivities)
  await invoke(user, "ActivitiesChainsContract", "createActivitiesChain",
    activitiesChainId, JSON.stringify(activitiesChain))
}

export {
  getSupplyActivity,
  splitLotsAndGetActivities,
  updateLotAndGetActivities,
  updateActivitiesChain
}