import { Harbor } from "./harbor.model"
import { Vessel } from "./vessel.model"
import { Activity } from "../base/activity.model"
import { ActivityInterface } from "~/interfaces/activity.interface"
import { GPSLocation } from "../base/gps-location.model"

class CaptureActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly harbor: Harbor,
    private readonly vessel: Vessel,
    private readonly location: GPSLocation
  ) {
    super(baseActivityData, "Penangkapan")
  }

  get Vessel() : Vessel {
    return this.vessel
  }

  get Harbor(): Harbor {
    return this.harbor
  }

  get Location(): GPSLocation {
    return this.location
  }
}

export {
  CaptureActivity
}