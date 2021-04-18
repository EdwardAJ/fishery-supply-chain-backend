import { ActivityInterface } from "~/interfaces/activity.interface"
import { FisheryProductLot } from "./fishery-product-lot.model"
import { Identity } from "./identity.model"
import { User } from "./user.model"

abstract class Activity extends Identity {
  protected readonly parentIds: string[] | null
  protected readonly currentLot: FisheryProductLot
  protected readonly owner: User
  protected readonly createdAt: string

  constructor (
    {
      id, parentIds,
      currentLot, owner, createdAt
    }: ActivityInterface,
    name: string
  ){
    super(id, name)
    this.parentIds = parentIds
    this.currentLot = currentLot
    this.owner = owner
    this.createdAt = createdAt
  }
  
  get ParentIds(): string[] | null {
    return this.parentIds
  }

  get CurrentLot(): FisheryProductLot {
    return this.currentLot
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