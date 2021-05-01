import { ActivityInterface } from "~/interfaces/activity.interface"
import { FisheryProductLot } from "./fishery-product-lot.model"
import { Identity } from "./identity.model"

class Activity extends Identity {
  protected readonly parentIds: string[] | null
  protected readonly lot: FisheryProductLot
  protected readonly createdAt: string

  constructor (
    {
      id, parentIds,
      lot, createdAt
    }: ActivityInterface,
    name: string
  ){
    super(id, name)
    this.parentIds = parentIds
    this.lot = lot
    this.createdAt = createdAt
  }
  
  get ParentIds(): string[] | null {
    return this.parentIds
  }

  get Lot(): FisheryProductLot {
    return this.lot
  }

  get CreatedAt(): string {
    return this.createdAt
  }
}

export {
  Activity
}