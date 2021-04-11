import { FisheryProductLot } from "./fishery-product-lot.model"
import { GPSLocation } from "./gps-location.model"
import { User } from "./user.model"

abstract class Activity {
  constructor (
    protected readonly id: string,
    protected readonly parentIds: string[] | null,
    protected readonly activityListId: string,
    protected readonly currentLot: FisheryProductLot,
    protected readonly location: GPSLocation,
    protected readonly owner: User,
    protected readonly createdAt: string
  ){}
  
  get Id(): string {
    return this.id
  }

  get ParentIds(): string[] | null {
    return this.parentIds
  }

  get ActivityListId(): string {
    return this.activityListId
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