import { ActivityInterface } from "~/interfaces/activity.interface"
import { FisheryProductLot } from "./fishery-product-lot.model"
import { GPSLocation } from "./gps-location.model"
import { User } from "./user.model"

abstract class Activity {
  protected readonly id: string
  protected readonly parentIds: string[] | null
  protected readonly currentLot: FisheryProductLot
  protected readonly location: GPSLocation
  protected readonly owner: User
  protected readonly createdAt: string

  constructor (
    { id, parentIds, currentLot, location, owner, createdAt }: ActivityInterface
  ){
    this.id = id
    this.parentIds = parentIds
    this.currentLot = currentLot
    this.location = location
    this.owner = owner
    this.createdAt = createdAt
  }
  
  get Id(): string {
    return this.id
  }

  get ParentIds(): string[] | null {
    return this.parentIds
  }

  get CurrentLot(): FisheryProductLot {
    return this.currentLot
  }

  get Location(): GPSLocation {
    return this.location
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