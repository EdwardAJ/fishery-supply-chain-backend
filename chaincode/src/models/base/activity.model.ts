
import { ActivityInterface } from "../../interfaces/base/activity.interface"
import { FisheryProductLot } from "./fishery-product-lot.model"

class Activity {
  protected readonly id: string
  protected readonly name: string
  protected readonly parentIds: string[] | null
  protected readonly lot: FisheryProductLot
  protected readonly createdAt: string

  constructor (
    {
      id, name, parentIds,
      lot, createdAt
    }: ActivityInterface
  ){
    this.id = id
    this.name = name
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

  get Id(): string {
    return this.id
  }

  get Name(): string {
    return this.name
  }
}

export {
  Activity
}