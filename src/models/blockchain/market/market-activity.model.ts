import { ActivityInterface } from "~/interfaces/activity.interface"
import { Activity } from "../base/activity.model"
import { GPSLocation } from "../base/gps-location.model"
import { ProcessTo } from "../process/process-to.model"

class MarketActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly processTo: ProcessTo,
    private readonly location: GPSLocation
  ) {
    super(baseActivityData, "Pasarkan")
  }

  get ProcessTo(): ProcessTo {
    return this.processTo
  }

  get Location(): GPSLocation {
    return this.location
  }
}

export {
  MarketActivity
}