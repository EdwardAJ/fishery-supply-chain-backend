 import { FisheryProductLot } from "~/models/blockchain/base/fishery-product-lot.model"
import { ProcessActivity } from "~/models/blockchain/process/process-activity.model"
import { Request } from "express"
import { Supplier } from "~/models/blockchain/process/supplier.model"
import { Storage } from "~/models/blockchain/process/storage.model"
import { User } from "~/models/blockchain/base/user.model"
import { GPSLocation } from "~/models/blockchain/base/gps-location.model"
import { invoke } from "~/services/invoke.service"
import { UserInterface } from "~/interfaces/user.interface"
import { ProcessTo } from "~/models/blockchain/process/process-to.model"

const getProcessActivity = 
  (req: Request, processActivityId: string, parentActivityIds: string[],
    productLot: FisheryProductLot, user: UserInterface
  ): ProcessActivity => {

  const {
    location: { latitude, longitude },
    supplier: { id: supplierId, name: supplierName },
    storage: { id: storageId, name: storageName },
    processTo: { id: processToId, name: processToName }
  } = req.body

  // TODO: change parentActivitiesChainIds
  return new ProcessActivity(
    {
      id: processActivityId,
      parentIds: parentActivityIds,
      currentLot: productLot,
      owner: new User(user.username, user.organization),
      createdAt: new Date().toISOString(),
    },
    new Supplier(supplierId, supplierName),
    new Storage(storageId, storageName),
    new ProcessTo(processToId, processToName),
    new GPSLocation(latitude, longitude),
  )
}

const updateLotAndGetActivities = async (
  req: Request, currentLot: FisheryProductLot, processActivityId: string,
  parentActivityIds: string[], user: UserInterface
): Promise<ProcessActivity[]> => {

  const supplyActivities: ProcessActivity[] = []
  await invoke(user, "ProductLotsContract", "createProductLot",
    currentLot.Id, JSON.stringify(currentLot))
  
  supplyActivities.push(
    getProcessActivity(req, processActivityId, parentActivityIds, currentLot, user)
  )

  return supplyActivities
}

export {
  getProcessActivity,
  updateLotAndGetActivities,
}