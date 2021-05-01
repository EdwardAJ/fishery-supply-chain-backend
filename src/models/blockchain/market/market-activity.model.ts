import { ActivityInterface } from "~/interfaces/activity.interface"
import { Activity } from "../base/activity.model"
import { GPSLocation } from "../base/gps-location.model"
import { MarketTo } from "../market/market-to.model"

class MarketActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly marketTo: MarketTo,
    private readonly location: GPSLocation
  ) {
    super(baseActivityData, "Pasarkan")
  }

  get MarketTo(): MarketTo {
    return this.marketTo
  }

  get Location(): GPSLocation {
    return this.location
  }
}

export {
  MarketActivity
}