import { ActivityInterface } from "~/interfaces/activity.interface"
import { FisheryProductLot } from "./fishery-product-lot.model"
import { Identity } from "./identity.model"
import { User } from "./user.model"

abstract class Activity extends Identity {
  protected readonly parentIds: string[] | null
  protected readonly lot: FisheryProductLot
  protected readonly owner: User
  protected readonly createdAt: string

  constructor (
    {
      id, parentIds,
      lot, owner, createdAt
    }: ActivityInterface,
    name: string
  ){
    super(id, name)
    this.parentIds = parentIds
    this.lot = lot
    this.owner = owner
    this.createdAt = createdAt
  }
  
  get ParentIds(): string[] | null {
    return this.parentIds
  }

  get Lot(): FisheryProductLot {
    return this.lot
  }

  get Owner(): User {
    return this.owner
  }

  get CreatedAt(): string {
    return this.createdAt
  }
}

export {
  Activity
}