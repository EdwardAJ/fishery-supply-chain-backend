import { GPSLocation } from "../base/gps-location.model"
import { Harbor } from "./harbor.model"
import { Vessel } from "./vessel.model"
import { Activity } from "../base/activity.model"
import { User } from "../base/user.model"
import { FisheryProductLot } from "../base/fishery-product-lot.model"

class CaptureActivity extends Activity {
  constructor (
    id: string,
    parentIds: string[] | null,
    activityListId: string,
    currentLot: FisheryProductLot,
    location: GPSLocation,
    owner: User,
    createdAt: string,
    private readonly vessel: Vessel,
    private readonly harbor: Harbor
  ) {
    super(id, parentIds, activityListId,
      currentLot,  location, owner, createdAt)
  }

  get Vessel() : Vessel {
    return this.vessel
  }

  get Harbor(): Harbor {
    return this.harbor
  }
}

export {
  CaptureActivity
}