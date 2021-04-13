/* eslint-disable @typescript-eslint/no-explicit-any */
import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"
import { SupplyActivity } from "~/models/blockchain/supply/supply-activity.model"
import { query } from "~/services/query.service"
import { getGeneratedUuid } from "../uuid.util"
import { Request } from "express"
import { Supplier } from "~/models/blockchain/supply/supplier.model"
import { Storage } from "~/models/blockchain/supply/storage.model"
import { User } from "~/models/blockchain/base/user.model"
import { GPSLocation } from "~/models/blockchain/base/gps-location.model"
import { invoke } from "~/services/invoke.service"
import { ActivitiesChain } from "~/models/blockchain/base/activities-chain.model"
import { UserInterface } from "~/interfaces/user.interface"

const validateLotInformation = async (currentLotIds: string[], newLots: any): Promise<void> => {
  if (!currentLotIds?.length)
    throw new Error("Please provide current lot information")

  if (currentLotIds.length > 1) {
    if (!newLots?.length) {
      throw new Error("Please provide new lot information")
    }        
  }
}


const getCurrentLots =
  async (currentLotIds: string[], user: UserInterface): Promise<FisheryProductLot[]> => {
  // Multiple currentLotIds mean that the user wants to combine multiple lots to one lot.
  // The activitiesChainId of every currentLotId inside currentLotIds must be the same.
  const currentLots: FisheryProductLot[] = []
  currentLotIds.map(async (lotId: string) => {
    const productLotString = 
      await query(
        user.organization, user.username, "ProductLotsContract", "getProductLot", lotId
      )
    
    const productLot = JSON.parse(productLotString.toString())
    if (!productLot) throw new Error("Current lot id does not exist")
    currentLots.push(productLot)
  })
  return currentLots
}

const getParentActivityIds = (currentLots: FisheryProductLot[]): string[] => {
  const parentActivityIds: string[] = []
  currentLots.map(({ ActivityId }) => {
    parentActivityIds.push(ActivityId)
  })
  return parentActivityIds
}

const getNewProductLots = (
  newLots: any, activitiesChainId: string, supplyActivityId: string
): FisheryProductLot[] => {

  const newProductLots: FisheryProductLot[] = []
  newLots.map((newLot: any) => {
    newProductLots.push(
      new FisheryProductLot(
        getGeneratedUuid(), newLot.weight, newLot.commodityType,
        activitiesChainId, supplyActivityId))
  })

  return newProductLots
}

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

  newProductLots.map(async (productLot: FisheryProductLot) => {
    await invoke(user, "ProductLotsContract", "createProductLot",
      productLot.Id, JSON.stringify(productLot))

    supplyActivities.push(
      getSupplyActivity(req, supplyActivityId, parentActivityIds, productLot, user)
    )
  })

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
  validateLotInformation,
  getCurrentLots,
  getParentActivityIds,
  getNewProductLots,
  getSupplyActivity,
  splitLotsAndGetActivities,
  updateLotAndGetActivities,
  updateActivitiesChain
}