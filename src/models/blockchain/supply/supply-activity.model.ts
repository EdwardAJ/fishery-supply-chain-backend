import { GPSLocation } from "../base/gps-location.model"

import { Activity } from "../base/activity.model"
import { User } from "../base/user.model"
import { FisheryProductLot } from "../base/fishery-product-lot.model"
import { Supplier } from "./supplier.model"
import { Storage } from "./storage.model"

class SupplyActivity extends Activity {
  constructor (
    id: string,
    parentIds: string[] | null,
    activityListId: string,
    currentLot: FisheryProductLot,
    location: GPSLocation,
    owner: User,
    createdAt: string,
    private readonly supplier: Supplier,
    private readonly storage: Storage
  ) {
    super(id, parentIds, activityListId,
      currentLot,  location, owner, createdAt)
  }

  get Supplier(): Supplier {
    return this.supplier
  }

  get Storage(): Storage {
    return this.storage
  }
}

export {
  SupplyActivity
}