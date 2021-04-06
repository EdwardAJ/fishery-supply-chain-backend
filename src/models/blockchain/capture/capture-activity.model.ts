import { GPSLocation } from "../base/gps-location.model"
import { Harbor } from "./harbor.model"
import { Vessel } from "./vessel.model"
import { Activity } from "../base/activity.model"
import { User } from "../base/user.model"
import { FisheryProductLot } from "../base/fishery-product-lot.model"

class CaptureActivity extends Activity {
  constructor (
    _id: string,
    _parentIds: string[] | null,
    _activityListId: string,
    _currentLot: FisheryProductLot,
    _location: GPSLocation,
    _createdAt: Date,
    _owner: User,
    private readonly _vessel: Vessel,
    private readonly _harbor: Harbor
  ) {
    super(_id, _parentIds, _activityListId,
      _currentLot,  _location, _createdAt, _owner)
  }

  get vessel() : Vessel {
    return this._vessel
  }

  get harbor(): Harbor {
    return this._harbor
  }
}

export {
  CaptureActivity
}