import { Activity } from "../base/activity.model"
import { ActivityInterface } from "../../interfaces/base/activity.interface"
import { IdentityInterface } from "../../interfaces/base/identity.interface"
import { LocationInterface } from "../../interfaces/base/location.interface"

class MarketActivity extends Activity {
  constructor (
    baseActivityData: ActivityInterface,
    private readonly marketTo: IdentityInterface,
    private readonly location: LocationInterface
  ) {
    super(baseActivityData)
  }

  get MarketTo(): IdentityInterface { 
    return this.marketTo
  }

  get Location(): LocationInterface {
    return this.location
  }
}

export {
  MarketActivity
}