import { FisheryProductLot } from "./fishery-product-lot.model"
import { GPSLocation } from "./gps-location.model"
import { User } from "./user.model"

abstract class Activity {
  constructor (
    protected readonly _id: string,
    protected readonly _parentIds: string[] | null,
    protected readonly _activityListId: string,
    protected readonly _currentLot: FisheryProductLot,
    protected readonly _location: GPSLocation,
    protected readonly _createdAt: Date,
    protected readonly _owner: User
  ){}
  
  get id(): string {
    return this._id
  }

  get parentIds(): string[] | null {
    return this._parentIds
  }

  get activityListId(): string {
    return this._activityListId
  }

  get currentLot(): FisheryProductLot {
    return this._currentLot
  }

  get location(): GPSLocation {
    return this._location
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get owner(): User {
    return this._owner
  }
}

export {
  Activity
}